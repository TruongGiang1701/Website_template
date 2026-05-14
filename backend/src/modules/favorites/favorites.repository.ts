import { query } from "@/lib/db";
import { formatVndLabel } from "@/modules/products/products.format";
import type { ProductListDbRow } from "@/modules/products/products.repository";
import { resolveActiveProductUuid } from "@/modules/cart/cart.repository";
import type { ProductListItemDTO } from "@/types/products";
import { FavoritesMutationError } from "./favorites.errors";

function coerceTagNames(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter((t): t is string => typeof t === "string");
}

function mapRowToListItem(row: ProductListDbRow): ProductListItemDTO {
  const legacy = row.legacy_key?.trim();
  const id = legacy && legacy.length > 0 ? legacy : row.slug;
  const priceVnd = Number(row.price_vnd);
  const image = row.primary_image?.trim() || "/images/products/product_1.png";
  const status = row.status as ProductListItemDTO["status"];
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
    price: formatVndLabel(priceVnd),
    status,
    deleted_at: row.deleted_at,
  };
}

export async function listFavoritesForUser(userId: string): Promise<ProductListItemDTO[]> {
  const uid = userId.trim();
  if (!uid) return [];

  const result = await query<ProductListDbRow>(
    `
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
    `,
    [uid],
  );

  return result.rows.map((row) => {
    const tags = coerceTagNames(row.tag_names as unknown);
    return mapRowToListItem({ ...row, tag_names: tags });
  });
}

export async function addFavoriteForUser(
  userId: string,
  clientProductId: string,
): Promise<void> {
  const uid = userId.trim();
  const resolved = await resolveActiveProductUuid(clientProductId);
  if (!resolved) {
    throw new FavoritesMutationError(
      "Không tìm thấy sản phẩm hoặc sản phẩm không còn bán.",
      404,
    );
  }
  await query(
    `
      INSERT INTO favorites (user_id, product_id)
      VALUES ($1::uuid, $2::uuid)
      ON CONFLICT (user_id, product_id) DO NOTHING
    `,
    [uid, resolved.productId],
  );
}

export async function removeFavoriteForUser(
  userId: string,
  clientProductId: string,
): Promise<boolean> {
  const uid = userId.trim();
  const trimmed = clientProductId.trim();
  if (!trimmed) return false;

  const resolved = await resolveActiveProductUuid(trimmed);
  if (!resolved) {
    throw new FavoritesMutationError(
      "Không tìm thấy sản phẩm hoặc sản phẩm không còn bán.",
      404,
    );
  }

  const del = await query(
    `
      DELETE FROM favorites
      WHERE user_id = $1::uuid AND product_id = $2::uuid
    `,
    [uid, resolved.productId],
  );
  return (del.rowCount ?? 0) > 0;
}

