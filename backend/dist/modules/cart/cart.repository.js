"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveActiveProductUuid = resolveActiveProductUuid;
exports.getOrCreateGuestCartId = getOrCreateGuestCartId;
exports.getCartSnapshotByCartId = getCartSnapshotByCartId;
exports.getGuestCart = getGuestCart;
exports.getOrCreateUserCartId = getOrCreateUserCartId;
exports.getUserCart = getUserCart;
exports.upsertUserCartItem = upsertUserCartItem;
exports.removeUserCartItem = removeUserCartItem;
exports.mergeGuestCartIntoUser = mergeGuestCartIntoUser;
exports.upsertGuestCartItem = upsertGuestCartItem;
exports.removeGuestCartItem = removeGuestCartItem;
const db_1 = require("../../lib/db");
const cart_errors_1 = require("./cart.errors");
const MAX_LINE_QTY = 99;
/** `clientProductId`: `products.id` (uuid), `legacy_key`, hoặc `slug`. */
async function resolveActiveProductUuid(clientProductId) {
    const trimmed = clientProductId.trim();
    if (!trimmed)
        return null;
    const res = await (0, db_1.query)(`
      SELECT p.id, p.price_vnd::text AS price_vnd
      FROM products p
      WHERE p.deleted_at IS NULL
        AND p.status = 'active'
        AND (p.id::text = $1 OR p.legacy_key = $1 OR p.slug = $1)
      LIMIT 1
    `, [trimmed]);
    const row = res.rows[0];
    if (!row)
        return null;
    const priceVnd = Number.parseInt(row.price_vnd, 10);
    return {
        productId: row.id,
        priceVnd: Number.isFinite(priceVnd) ? priceVnd : 0,
    };
}
/** Khóa công khai giống `mapRowToListItem` trong products.repository. */
function publicProductId(legacyKey, slug) {
    const legacy = legacyKey?.trim();
    return legacy && legacy.length > 0 ? legacy : slug;
}
async function getOrCreateGuestCartId(sessionId) {
    const client = await (0, db_1.getDbPool)().connect();
    try {
        await client.query("BEGIN");
        const sel = await client.query(`
        SELECT id FROM carts
        WHERE session_id = $1 AND user_id IS NULL
        FOR UPDATE
      `, [sessionId]);
        if (sel.rows[0]) {
            await client.query("COMMIT");
            return sel.rows[0].id;
        }
        const ins = await client.query(`
        INSERT INTO carts (user_id, session_id)
        VALUES (NULL, $1)
        RETURNING id
      `, [sessionId]);
        await client.query("COMMIT");
        return ins.rows[0].id;
    }
    catch (e) {
        try {
            await client.query("ROLLBACK");
        }
        catch {
            /* ignore */
        }
        const again = await (0, db_1.query)(`
        SELECT id FROM carts
        WHERE session_id = $1 AND user_id IS NULL
        LIMIT 1
      `, [sessionId]);
        if (again.rows[0])
            return again.rows[0].id;
        throw e;
    }
    finally {
        client.release();
    }
}
async function pruneInactiveCartItems(cartId) {
    await (0, db_1.query)(`
      DELETE FROM cart_items ci
      USING products p
      WHERE ci.cart_id = $1::uuid
        AND ci.product_id = p.id
        AND (p.deleted_at IS NOT NULL OR p.status <> 'active')
    `, [cartId]);
}
/** Dòng giỏ theo `cart_id` (guest hoặc user) sau khi prune sản phẩm không còn bán. */
async function getCartSnapshotByCartId(cartId) {
    await pruneInactiveCartItems(cartId);
    const rows = await (0, db_1.query)(`
      SELECT
        ci.qty::text,
        p.legacy_key,
        p.slug
      FROM cart_items ci
      JOIN products p ON p.id = ci.product_id
      WHERE ci.cart_id = $1::uuid
        AND p.deleted_at IS NULL
        AND p.status = 'active'
      ORDER BY ci.updated_at DESC
    `, [cartId]);
    const lines = rows.rows.map((r) => ({
        id: publicProductId(r.legacy_key, r.slug),
        qty: Math.min(MAX_LINE_QTY, Math.max(1, Number.parseInt(r.qty, 10) || 1)),
    }));
    return { cartId, lines };
}
async function getGuestCart(sessionId) {
    const cartId = await getOrCreateGuestCartId(sessionId);
    return getCartSnapshotByCartId(cartId);
}
/** Giỏ đăng nhập: lấy giỏ mới nhất của user (tạo mới nếu chưa có). */
async function getOrCreateUserCartId(userId) {
    const trimmed = userId.trim();
    if (!trimmed) {
        throw new cart_errors_1.CartMutationError("Thiếu user.", 400);
    }
    const sel = await (0, db_1.query)(`
      SELECT id FROM carts
      WHERE user_id = $1::uuid
      ORDER BY updated_at DESC NULLS LAST, created_at DESC
      LIMIT 1
    `, [trimmed]);
    if (sel.rows[0])
        return sel.rows[0].id;
    const ins = await (0, db_1.query)(`
      INSERT INTO carts (user_id, session_id)
      VALUES ($1::uuid, NULL)
      RETURNING id
    `, [trimmed]);
    return ins.rows[0].id;
}
async function getUserCart(userId) {
    const cartId = await getOrCreateUserCartId(userId);
    return getCartSnapshotByCartId(cartId);
}
async function upsertUserCartItem(userId, clientProductId, qty) {
    const resolved = await resolveActiveProductUuid(clientProductId);
    if (!resolved) {
        throw new cart_errors_1.CartMutationError("Không tìm thấy sản phẩm hoặc sản phẩm không còn bán.", 404);
    }
    const safeQty = Math.min(MAX_LINE_QTY, Math.max(1, Math.floor(qty)));
    const cartId = await getOrCreateUserCartId(userId);
    await (0, db_1.query)(`
      INSERT INTO cart_items (cart_id, product_id, qty, price_snapshot_vnd)
      VALUES ($1::uuid, $2::uuid, $3, $4)
      ON CONFLICT (cart_id, product_id) DO UPDATE SET
        qty = EXCLUDED.qty,
        price_snapshot_vnd = EXCLUDED.price_snapshot_vnd,
        updated_at = now()
    `, [cartId, resolved.productId, safeQty, resolved.priceVnd]);
}
async function removeUserCartItem(userId, clientProductId) {
    const uid = userId.trim();
    const trimmed = clientProductId.trim();
    if (!uid)
        throw new cart_errors_1.CartMutationError("Thiếu user.", 400);
    if (!trimmed)
        return false;
    const cartRow = await (0, db_1.query)(`
      SELECT id FROM carts
      WHERE user_id = $1::uuid
      ORDER BY updated_at DESC NULLS LAST, created_at DESC
      LIMIT 1
    `, [uid]);
    const cartId = cartRow.rows[0]?.id;
    if (!cartId)
        return false;
    const del = await (0, db_1.query)(`
      DELETE FROM cart_items ci
      USING products p
      WHERE ci.cart_id = $1::uuid
        AND ci.product_id = p.id
        AND (p.id::text = $2 OR p.legacy_key = $2 OR p.slug = $2)
    `, [cartId, trimmed]);
    return (del.rowCount ?? 0) > 0;
}
/**
 * Sau đăng nhập: gắn giỏ guest (cookie `session_id`) vào user, gộp dòng nếu user đã có giỏ.
 */
async function mergeGuestCartIntoUser(sessionId, userId) {
    const sid = sessionId.trim();
    const uid = userId.trim();
    if (!sid) {
        throw new cart_errors_1.CartMutationError("Thiếu session giỏ guest.", 400);
    }
    if (!uid) {
        throw new cart_errors_1.CartMutationError("Thiếu user.", 400);
    }
    const client = await (0, db_1.getDbPool)().connect();
    try {
        await client.query("BEGIN");
        const guestRes = await client.query(`
        SELECT id FROM carts
        WHERE session_id = $1 AND user_id IS NULL
        FOR UPDATE
      `, [sid]);
        const guestCartId = guestRes.rows[0]?.id;
        const userRes = await client.query(`
        SELECT id FROM carts
        WHERE user_id = $1::uuid
        ORDER BY updated_at DESC NULLS LAST, created_at DESC
        LIMIT 1
        FOR UPDATE
      `, [uid]);
        let userCartId = userRes.rows[0]?.id;
        if (!guestCartId) {
            if (!userCartId) {
                const ins = await client.query(`
            INSERT INTO carts (user_id, session_id)
            VALUES ($1::uuid, NULL)
            RETURNING id
          `, [uid]);
                userCartId = ins.rows[0].id;
            }
            await client.query("COMMIT");
            return getCartSnapshotByCartId(userCartId);
        }
        const countRes = await client.query(`SELECT count(*)::text AS n FROM cart_items WHERE cart_id = $1::uuid`, [guestCartId]);
        const guestItemCount = Number.parseInt(countRes.rows[0]?.n ?? "0", 10) || 0;
        if (guestItemCount === 0) {
            if (!userCartId) {
                await client.query(`
            UPDATE carts
            SET user_id = $1::uuid, session_id = NULL, updated_at = now()
            WHERE id = $2::uuid AND user_id IS NULL
          `, [uid, guestCartId]);
                await client.query("COMMIT");
                return getCartSnapshotByCartId(guestCartId);
            }
            await client.query(`DELETE FROM carts WHERE id = $1::uuid`, [guestCartId]);
            await client.query("COMMIT");
            return getCartSnapshotByCartId(userCartId);
        }
        if (!userCartId) {
            await client.query(`
          UPDATE carts
          SET user_id = $1::uuid, session_id = NULL, updated_at = now()
          WHERE id = $2::uuid AND user_id IS NULL
        `, [uid, guestCartId]);
            await client.query("COMMIT");
            return getCartSnapshotByCartId(guestCartId);
        }
        if (guestCartId === userCartId) {
            await client.query("COMMIT");
            return getCartSnapshotByCartId(userCartId);
        }
        await client.query(`
        INSERT INTO cart_items (cart_id, product_id, qty, price_snapshot_vnd)
        SELECT $1::uuid, g.product_id,
          LEAST($3, COALESCE(u.qty, 0) + g.qty)::integer,
          g.price_snapshot_vnd
        FROM cart_items g
        LEFT JOIN cart_items u ON u.cart_id = $1::uuid AND u.product_id = g.product_id
        WHERE g.cart_id = $2::uuid
        ON CONFLICT (cart_id, product_id) DO UPDATE SET
          qty = EXCLUDED.qty,
          price_snapshot_vnd = EXCLUDED.price_snapshot_vnd,
          updated_at = now()
      `, [userCartId, guestCartId, MAX_LINE_QTY]);
        await client.query(`DELETE FROM cart_items WHERE cart_id = $1::uuid`, [guestCartId]);
        await client.query(`DELETE FROM carts WHERE id = $1::uuid`, [guestCartId]);
        await client.query("COMMIT");
        return getCartSnapshotByCartId(userCartId);
    }
    catch (e) {
        try {
            await client.query("ROLLBACK");
        }
        catch {
            /* ignore */
        }
        throw e;
    }
    finally {
        client.release();
    }
}
async function upsertGuestCartItem(sessionId, clientProductId, qty) {
    const resolved = await resolveActiveProductUuid(clientProductId);
    if (!resolved) {
        throw new cart_errors_1.CartMutationError("Không tìm thấy sản phẩm hoặc sản phẩm không còn bán.", 404);
    }
    const safeQty = Math.min(MAX_LINE_QTY, Math.max(1, Math.floor(qty)));
    const cartId = await getOrCreateGuestCartId(sessionId);
    await (0, db_1.query)(`
      INSERT INTO cart_items (cart_id, product_id, qty, price_snapshot_vnd)
      VALUES ($1::uuid, $2::uuid, $3, $4)
      ON CONFLICT (cart_id, product_id) DO UPDATE SET
        qty = EXCLUDED.qty,
        price_snapshot_vnd = EXCLUDED.price_snapshot_vnd,
        updated_at = now()
    `, [cartId, resolved.productId, safeQty, resolved.priceVnd]);
}
async function removeGuestCartItem(sessionId, clientProductId) {
    const trimmed = clientProductId.trim();
    if (!trimmed)
        return false;
    const cartRow = await (0, db_1.query)(`
      SELECT id FROM carts
      WHERE session_id = $1 AND user_id IS NULL
      LIMIT 1
    `, [sessionId]);
    const cartId = cartRow.rows[0]?.id;
    if (!cartId)
        return false;
    const del = await (0, db_1.query)(`
      DELETE FROM cart_items ci
      USING products p
      WHERE ci.cart_id = $1::uuid
        AND ci.product_id = p.id
        AND (p.id::text = $2 OR p.legacy_key = $2 OR p.slug = $2)
    `, [cartId, trimmed]);
    return (del.rowCount ?? 0) > 0;
}
