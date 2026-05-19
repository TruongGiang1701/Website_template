"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listFavoritesForUser = listFavoritesForUser;
exports.addFavoriteForUser = addFavoriteForUser;
exports.removeFavoriteForUser = removeFavoriteForUser;
const db_1 = require("../../lib/db");
const products_format_1 = require("../../modules/products/products.format");
const cart_repository_1 = require("../../modules/cart/cart.repository");
const favorites_errors_1 = require("./favorites.errors");
function coerceTagNames(raw) {
    if (!Array.isArray(raw))
        return [];
    return raw.filter((t) => typeof t === "string");
}
function mapRowToListItem(row) {
    const legacy = row.legacy_key?.trim();
    const id = legacy && legacy.length > 0 ? legacy : row.slug;
    const priceVnd = Number(row.price_vnd);
    const image = row.primary_image?.trim() || "/images/products/product_1.png";
    const status = row.status;
    return {
        id,
        uuid: row.uuid,
        slug: row.slug,
        title: row.title,
        group: row.group_name,
        tags: Array.isArray(row.tag_names) ? row.tag_names : [],
        image,
        href: `/templates/${row.slug}`,
        featured: Boolean(row.featured),
        price_vnd: priceVnd,
        price: (0, products_format_1.formatVndLabel)(priceVnd),
        status,
        deleted_at: row.deleted_at,
    };
}
async function listFavoritesForUser(userId) {
    const uid = userId.trim();
    if (!uid)
        return [];
    const result = await (0, db_1.query)(`
      SELECT
        p.id AS uuid,
        p.legacy_key,
        p.slug,
        p.title,
        p.group_name,
        p.price_vnd::text,
        p.featured,
        p.status::text,
        p.deleted_at::text,
        pi.url AS primary_image,
        COALESCE(
          (
            SELECT json_agg(tt.name ORDER BY tt.name)
            FROM product_tags ppt
            JOIN tags tt ON tt.id = ppt.tag_id
            WHERE ppt.product_id = p.id
          ),
          '[]'::json
        ) AS tag_names
      FROM favorites f
      JOIN products p ON p.id = f.product_id
      LEFT JOIN LATERAL (
        SELECT url FROM product_images pi2
        WHERE pi2.product_id = p.id
        ORDER BY pi2.sort_order ASC, pi2.created_at ASC
        LIMIT 1
      ) pi ON TRUE
      WHERE f.user_id = $1::uuid
        AND p.deleted_at IS NULL
        AND p.status = 'active'
      ORDER BY f.created_at DESC
    `, [uid]);
    return result.rows.map((row) => {
        const tags = coerceTagNames(row.tag_names);
        return mapRowToListItem({ ...row, tag_names: tags });
    });
}
async function addFavoriteForUser(userId, clientProductId) {
    const uid = userId.trim();
    const resolved = await (0, cart_repository_1.resolveActiveProductUuid)(clientProductId);
    if (!resolved) {
        throw new favorites_errors_1.FavoritesMutationError("Không tìm thấy sản phẩm hoặc sản phẩm không còn bán.", 404);
    }
    await (0, db_1.query)(`
      INSERT INTO favorites (user_id, product_id)
      VALUES ($1::uuid, $2::uuid)
      ON CONFLICT (user_id, product_id) DO NOTHING
    `, [uid, resolved.productId]);
}
async function removeFavoriteForUser(userId, clientProductId) {
    const uid = userId.trim();
    const trimmed = clientProductId.trim();
    if (!trimmed)
        return false;
    const resolved = await (0, cart_repository_1.resolveActiveProductUuid)(trimmed);
    if (!resolved) {
        throw new favorites_errors_1.FavoritesMutationError("Không tìm thấy sản phẩm hoặc sản phẩm không còn bán.", 404);
    }
    const del = await (0, db_1.query)(`
      DELETE FROM favorites
      WHERE user_id = $1::uuid AND product_id = $2::uuid
    `, [uid, resolved.productId]);
    return (del.rowCount ?? 0) > 0;
}
