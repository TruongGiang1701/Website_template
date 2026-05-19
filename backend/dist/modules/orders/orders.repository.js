"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrderFromCurrentCart = createOrderFromCurrentCart;
exports.listOrdersByUser = listOrdersByUser;
exports.getOrderByCodeForUser = getOrderByCodeForUser;
exports.getOrderByIdForAdmin = getOrderByIdForAdmin;
exports.listOrdersForAdmin = listOrdersForAdmin;
exports.patchOrderStatusForAdmin = patchOrderStatusForAdmin;
const uuid_1 = require("uuid");
const db_1 = require("../../lib/db");
const orders_errors_1 = require("./orders.errors");
function publicProductId(legacyKey, slug) {
    const legacy = legacyKey?.trim();
    return legacy && legacy.length > 0 ? legacy : slug;
}
function toOrderStatus(value) {
    if (value === "pending" || value === "processing" || value === "completed" || value === "cancelled") {
        return value;
    }
    return "pending";
}
function toPaymentStatus(value) {
    if (value === "unpaid" || value === "paid" || value === "failed" || value === "refunded") {
        return value;
    }
    return "unpaid";
}
function parseOrderStatusFilter(value) {
    if (!value?.trim())
        return null;
    const s = value.trim();
    if (s === "pending" || s === "processing" || s === "completed" || s === "cancelled") {
        return s;
    }
    return null;
}
function parsePaymentStatusFilter(value) {
    if (!value?.trim())
        return null;
    const s = value.trim();
    if (s === "unpaid" || s === "paid" || s === "failed" || s === "refunded") {
        return s;
    }
    return null;
}
function toInt(raw) {
    const n = Number.parseInt(String(raw ?? "0"), 10);
    return Number.isFinite(n) ? n : 0;
}
function mapSummary(row) {
    return {
        id: row.id,
        code: row.code,
        status: toOrderStatus(row.status),
        payment_status: toPaymentStatus(row.payment_status),
        subtotal_vnd: toInt(row.subtotal_vnd),
        discount_vnd: toInt(row.discount_vnd),
        total_vnd: toInt(row.total_vnd),
        contact_name: row.contact_name,
        contact_email: row.contact_email,
        note: row.note,
        created_at: row.created_at,
        updated_at: row.updated_at,
        item_count: toInt(row.item_count),
        total_qty: toInt(row.total_qty),
    };
}
function mapBase(row) {
    return {
        id: row.id,
        code: row.code,
        status: toOrderStatus(row.status),
        payment_status: toPaymentStatus(row.payment_status),
        subtotal_vnd: toInt(row.subtotal_vnd),
        discount_vnd: toInt(row.discount_vnd),
        total_vnd: toInt(row.total_vnd),
        contact_name: row.contact_name,
        contact_email: row.contact_email,
        note: row.note,
        created_at: row.created_at,
        updated_at: row.updated_at,
    };
}
function mapItem(row) {
    const qty = toInt(row.qty);
    const price = toInt(row.price_snapshot_vnd);
    return {
        product_uuid: row.product_uuid,
        product_id: publicProductId(row.legacy_key, row.slug),
        product_slug: row.slug,
        title_snapshot: row.title_snapshot,
        price_snapshot_vnd: price,
        qty,
        line_total_vnd: qty * price,
    };
}
function mapEvent(row) {
    return {
        id: row.id,
        actor_user_id: row.actor_user_id,
        source: row.source,
        event_type: row.event_type,
        prev_status: row.prev_status,
        next_status: row.next_status,
        prev_payment_status: row.prev_payment_status,
        next_payment_status: row.next_payment_status,
        note: row.note,
        created_at: row.created_at,
    };
}
function buildOrderCode() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    const ss = String(d.getSeconds()).padStart(2, "0");
    const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
    return `ORD-${y}${m}${day}-${hh}${mm}${ss}-${rand}`;
}
async function createOrderFromCurrentCart(userId, input) {
    const uid = userId.trim();
    if (!uid) {
        throw new orders_errors_1.OrdersMutationError("Thiếu user.", 400);
    }
    const contactName = input.contact_name?.trim() || null;
    const contactEmail = input.contact_email?.trim() || null;
    const note = input.note?.trim() || null;
    const client = await (0, db_1.getDbPool)().connect();
    try {
        await client.query("BEGIN");
        const cartRes = await client.query(`
        SELECT c.id
        FROM carts c
        WHERE c.user_id = $1::uuid
        ORDER BY c.updated_at DESC NULLS LAST, c.created_at DESC
        LIMIT 1
        FOR UPDATE
      `, [uid]);
        const cartId = cartRes.rows[0]?.id;
        if (!cartId) {
            throw new orders_errors_1.OrdersMutationError("Giỏ hàng đang trống.", 400);
        }
        const rows = await client.query(`
        SELECT
          COALESCE(SUM(ci.qty * ci.price_snapshot_vnd), 0)::text AS subtotal_vnd
        FROM cart_items ci
        WHERE ci.cart_id = $1::uuid
      `, [cartId]);
        const subtotal = toInt(rows.rows[0]?.subtotal_vnd);
        if (subtotal <= 0) {
            throw new orders_errors_1.OrdersMutationError("Giỏ hàng đang trống.", 400);
        }
        let orderId = "";
        let orderCode = "";
        for (let i = 0; i < 5; i += 1) {
            const code = buildOrderCode();
            try {
                const inserted = await client.query(`
            INSERT INTO orders (
              code, user_id, status, payment_status,
              subtotal_vnd, discount_vnd, total_vnd,
              contact_name, contact_email, note
            )
            VALUES (
              $1, $2::uuid, 'pending', 'unpaid',
              $3, 0, $3,
              $4, $5, $6
            )
            RETURNING id, code
          `, [code, uid, subtotal, contactName, contactEmail, note]);
                orderId = inserted.rows[0].id;
                orderCode = inserted.rows[0].code;
                break;
            }
            catch (e) {
                const code = typeof e === "object" && e && "code" in e ? String(e.code) : "";
                if (code !== "23505")
                    throw e;
            }
        }
        if (!orderId || !orderCode) {
            throw new orders_errors_1.OrdersMutationError("Không tạo được mã đơn hàng, vui lòng thử lại.", 500);
        }
        await client.query(`
        INSERT INTO order_items (
          order_id,
          product_id,
          title_snapshot,
          price_snapshot_vnd,
          qty
        )
        SELECT
          $1::uuid,
          ci.product_id,
          p.title,
          ci.price_snapshot_vnd,
          ci.qty
        FROM cart_items ci
        JOIN products p ON p.id = ci.product_id
        WHERE ci.cart_id = $2::uuid
      `, [orderId, cartId]);
        await client.query(`
        INSERT INTO order_events (
          order_id,
          actor_user_id,
          source,
          event_type,
          prev_status,
          next_status,
          prev_payment_status,
          next_payment_status,
          note
        )
        VALUES (
          $1::uuid,
          $2::uuid,
          'customer',
          'order_created',
          NULL,
          'pending',
          NULL,
          'unpaid',
          $3
        )
      `, [orderId, uid, note]);
        await client.query(`DELETE FROM cart_items WHERE cart_id = $1::uuid`, [cartId]);
        await client.query(`UPDATE carts SET updated_at = now() WHERE id = $1::uuid`, [cartId]);
        await client.query("COMMIT");
        return getOrderByCodeForUser(uid, orderCode);
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
async function listOrdersByUser(userId) {
    const uid = userId.trim();
    if (!uid)
        return [];
    const result = await (0, db_1.query)(`
      SELECT
        o.id,
        o.code,
        o.status::text,
        o.payment_status::text,
        o.subtotal_vnd::text,
        o.discount_vnd::text,
        o.total_vnd::text,
        o.contact_name,
        o.contact_email::text,
        o.note,
        o.created_at::text,
        o.updated_at::text,
        COALESCE(oi.item_count, 0)::text AS item_count,
        COALESCE(oi.total_qty, 0)::text AS total_qty
      FROM orders o
      LEFT JOIN LATERAL (
        SELECT
          COUNT(*)::integer AS item_count,
          COALESCE(SUM(oi2.qty), 0)::integer AS total_qty
        FROM order_items oi2
        WHERE oi2.order_id = o.id
      ) oi ON TRUE
      WHERE o.user_id = $1::uuid
      ORDER BY o.created_at DESC
    `, [uid]);
    return result.rows.map(mapSummary);
}
async function fetchOrderItemsAndEvents(orderId) {
    const items = await (0, db_1.query)(`
      SELECT
        p.id::text AS product_uuid,
        p.legacy_key,
        p.slug,
        oi.title_snapshot,
        oi.price_snapshot_vnd::text,
        oi.qty::text
      FROM order_items oi
      JOIN products p ON p.id = oi.product_id
      WHERE oi.order_id = $1::uuid
      ORDER BY oi.title_snapshot ASC
    `, [orderId]);
    const events = await (0, db_1.query)(`
      SELECT
        oe.id,
        oe.actor_user_id::text AS actor_user_id,
        oe.source::text AS source,
        oe.event_type,
        oe.prev_status,
        oe.next_status,
        oe.prev_payment_status,
        oe.next_payment_status,
        oe.note,
        oe.created_at::text
      FROM order_events oe
      WHERE oe.order_id = $1::uuid
      ORDER BY oe.created_at DESC
    `, [orderId]);
    return {
        items: items.rows.map(mapItem),
        events: events.rows.map(mapEvent),
    };
}
async function getOrderByCodeForUser(userId, code) {
    const uid = userId.trim();
    const c = code.trim();
    if (!uid || !c) {
        throw new orders_errors_1.OrdersMutationError("Thiếu thông tin đơn hàng.", 400);
    }
    const base = await (0, db_1.query)(`
      SELECT
        o.id,
        o.code,
        o.status::text,
        o.payment_status::text,
        o.subtotal_vnd::text,
        o.discount_vnd::text,
        o.total_vnd::text,
        o.contact_name,
        o.contact_email::text,
        o.note,
        o.created_at::text,
        o.updated_at::text
      FROM orders o
      WHERE o.user_id = $1::uuid
        AND o.code = $2
      LIMIT 1
    `, [uid, c]);
    const row = base.rows[0];
    if (!row) {
        throw new orders_errors_1.OrdersMutationError("Không tìm thấy đơn hàng.", 404);
    }
    const { items, events } = await fetchOrderItemsAndEvents(row.id);
    return {
        ...mapBase(row),
        items,
        events,
    };
}
async function getOrderByIdForAdmin(orderId) {
    const id = orderId.trim();
    if (!id) {
        throw new orders_errors_1.OrdersMutationError("Thiếu id đơn hàng.", 400);
    }
    if (!(0, uuid_1.validate)(id)) {
        throw new orders_errors_1.OrdersMutationError("Id đơn hàng không hợp lệ.", 400);
    }
    const base = await (0, db_1.query)(`
      SELECT
        o.id,
        o.code,
        o.status::text,
        o.payment_status::text,
        o.subtotal_vnd::text,
        o.discount_vnd::text,
        o.total_vnd::text,
        o.contact_name,
        o.contact_email::text,
        o.note,
        o.created_at::text,
        o.updated_at::text,
        o.user_id::text AS user_id,
        u.email::text AS user_account_email,
        u.name AS user_account_name
      FROM orders o
      LEFT JOIN users u ON u.id = o.user_id
      WHERE o.id = $1::uuid
      LIMIT 1
    `, [id]);
    const row = base.rows[0];
    if (!row) {
        throw new orders_errors_1.OrdersMutationError("Không tìm thấy đơn hàng.", 404);
    }
    const { items, events } = await fetchOrderItemsAndEvents(row.id);
    return {
        ...mapBase(row),
        user_id: row.user_id,
        user_account_email: row.user_account_email,
        user_account_name: row.user_account_name,
        items,
        events,
    };
}
function mapAdminSummary(row) {
    return {
        ...mapSummary(row),
        user_id: row.user_id,
        user_account_email: row.user_account_email,
    };
}
async function listOrdersForAdmin(input) {
    const page = Math.max(1, input.page);
    const pageSize = Math.min(100, Math.max(1, input.pageSize));
    const offset = (page - 1) * pageSize;
    const statusFilter = parseOrderStatusFilter(input.status);
    const paymentFilter = parsePaymentStatusFilter(input.payment_status);
    const qRaw = input.q?.trim() ?? "";
    const q = qRaw.length > 0 ? qRaw : null;
    const params = [statusFilter, paymentFilter, q];
    const whereSql = `
    WHERE ($1::text IS NULL OR o.status = $1)
      AND ($2::text IS NULL OR o.payment_status = $2)
      AND (
        $3::text IS NULL
        OR strpos(lower(o.code), lower(btrim($3::text))) > 0
        OR strpos(lower(COALESCE(o.contact_email::text, '')), lower(btrim($3::text))) > 0
        OR strpos(lower(COALESCE(u.email::text, '')), lower(btrim($3::text))) > 0
      )
  `;
    const countRes = await (0, db_1.query)(`
      SELECT COUNT(*)::text AS total
      FROM orders o
      LEFT JOIN users u ON u.id = o.user_id
      ${whereSql}
    `, params);
    const total = toInt(countRes.rows[0]?.total);
    const listParams = [...params, pageSize, offset];
    const result = await (0, db_1.query)(`
      SELECT
        o.id,
        o.code,
        o.status::text,
        o.payment_status::text,
        o.subtotal_vnd::text,
        o.discount_vnd::text,
        o.total_vnd::text,
        o.contact_name,
        o.contact_email::text,
        o.note,
        o.created_at::text,
        o.updated_at::text,
        COALESCE(oi.item_count, 0)::text AS item_count,
        COALESCE(oi.total_qty, 0)::text AS total_qty,
        o.user_id::text AS user_id,
        u.email::text AS user_account_email
      FROM orders o
      LEFT JOIN users u ON u.id = o.user_id
      LEFT JOIN LATERAL (
        SELECT
          COUNT(*)::integer AS item_count,
          COALESCE(SUM(oi2.qty), 0)::integer AS total_qty
        FROM order_items oi2
        WHERE oi2.order_id = o.id
      ) oi ON TRUE
      ${whereSql}
      ORDER BY o.created_at DESC
      LIMIT $4::integer OFFSET $5::integer
    `, listParams);
    return {
        items: result.rows.map(mapAdminSummary),
        total,
        page,
        pageSize,
    };
}
async function patchOrderStatusForAdmin(orderId, actorUserId, nextStatus) {
    const oid = orderId.trim();
    const actor = actorUserId.trim();
    if (!oid || !actor) {
        throw new orders_errors_1.OrdersMutationError("Thiếu thông tin.", 400);
    }
    if (!(0, uuid_1.validate)(oid)) {
        throw new orders_errors_1.OrdersMutationError("Id đơn hàng không hợp lệ.", 400);
    }
    const client = await (0, db_1.getDbPool)().connect();
    try {
        await client.query("BEGIN");
        const cur = await client.query(`
        SELECT o.status::text, o.payment_status::text
        FROM orders o
        WHERE o.id = $1::uuid
        FOR UPDATE
      `, [oid]);
        const row = cur.rows[0];
        if (!row) {
            throw new orders_errors_1.OrdersMutationError("Không tìm thấy đơn hàng.", 404);
        }
        const prevStatus = toOrderStatus(row.status);
        const prevPayment = toPaymentStatus(row.payment_status);
        if (prevStatus === nextStatus) {
            await client.query("COMMIT");
            return getOrderByIdForAdmin(oid);
        }
        await client.query(`
        UPDATE orders
        SET status = $2::text
        WHERE id = $1::uuid
      `, [oid, nextStatus]);
        await client.query(`
        INSERT INTO order_events (
          order_id,
          actor_user_id,
          source,
          event_type,
          prev_status,
          next_status,
          prev_payment_status,
          next_payment_status,
          note
        )
        VALUES (
          $1::uuid,
          $2::uuid,
          'admin',
          'order_status_updated',
          $3::text,
          $4::text,
          $5::text,
          $6::text,
          NULL
        )
      `, [oid, actor, prevStatus, nextStatus, prevPayment, prevPayment]);
        await client.query("COMMIT");
        return getOrderByIdForAdmin(oid);
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
