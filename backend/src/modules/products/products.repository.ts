import { query } from "@/lib/db";
import type { ProductDetailDTO, ProductListItemDTO } from "@/types/products";
import { formatVndLabel } from "./products.format";

function coerceTagNames(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter((t): t is string => typeof t === "string");
}

export type ProductDetailMode = "public" | "manage";

export type ProductListDbRow = {
  uuid: string;
  legacy_key: string | null;
  slug: string;
  title: string;
  group_name: string;
  price_vnd: string;
  featured: boolean;
  primary_image: string | null;
  tag_names: string[] | null;
  status: string;
  deleted_at: string | null;
};

export type ProductDetailDbRow = {
  uuid: string;
  legacy_key: string | null;
  slug: string;
  title: string;
  description: string | null;
  group_name: string;
  price_vnd: string;
  featured: boolean;
  try_url: string | null;
  primary_image: string | null;
  tag_names: string[] | null;
  status: string;
  deleted_at: string | null;
};

export type ProductImageDbRow = {
  url: string;
  alt: string | null;
  sort_order: number;
};

export type ListProductsFilter = {
  q?: string;
  /** Mot nhom (tuong thich cu) */
  group?: string;
  /** Nhieu nhom (OR) - dung cho sidebar chon nhieu the loai */
  groups?: string[];
  /** Loc theo `legacy_key` (vd. tpl-01) - gio hang / yeu thich */
  legacy_keys?: string[];
  /** Loc khoang gia / khuyen mai (khop UI sidebar) */
  price_bucket?: "under_10m" | "10m_15m" | "promo";
  featured?: boolean;
  all_status?: boolean;
  include_deleted?: boolean;
};

function buildListWhere(filters: ListProductsFilter): {
  whereSql: string;
  params: unknown[];
} {
  const qTrim = filters.q?.trim() || "";
  const groupTrim = filters.group?.trim() || "";
  const hasFeatured =
    filters.featured === true || filters.featured === false
      ? filters.featured
      : undefined;

  const clauses: string[] = [];
  const params: unknown[] = [];

  if (!filters.all_status) clauses.push(`p.status = 'active'`);
  if (!filters.include_deleted) clauses.push(`p.deleted_at IS NULL`);

  if (qTrim.length > 0) {
    params.push(`%${qTrim}%`);
    clauses.push(`p.title ILIKE $${params.length}`);
  }
  const legacyKeys = (filters.legacy_keys ?? [])
    .map((k) => k.trim())
    .filter(Boolean);
  if (legacyKeys.length > 0) {
    params.push(legacyKeys);
    clauses.push(`p.legacy_key = ANY($${params.length}::text[])`);
  }

  const groups = (filters.groups ?? []).map((g) => g.trim()).filter(Boolean);
  if (groups.length > 0) {
    params.push(groups);
    clauses.push(`p.group_name = ANY($${params.length}::text[])`);
  } else if (groupTrim.length > 0) {
    params.push(groupTrim);
    clauses.push(`p.group_name = $${params.length}`);
  }

  if (filters.price_bucket === "under_10m") {
    clauses.push(`p.price_vnd < 10000000`);
  } else if (filters.price_bucket === "10m_15m") {
    clauses.push(`p.price_vnd >= 10000000 AND p.price_vnd <= 15000000`);
  } else if (filters.price_bucket === "promo") {
    clauses.push(`p.featured = true`);
  }

  if (hasFeatured !== undefined) {
    params.push(hasFeatured);
    clauses.push(`p.featured = $${params.length}`);
  }

  const whereSql = clauses.length > 0 ? clauses.join(" AND ") : "TRUE";
  return { whereSql, params };
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

export async function countProducts(filters: ListProductsFilter): Promise<number> {
  const { whereSql, params } = buildListWhere(filters);
  const res = await query<{ cnt: string }>(
    `
      SELECT COUNT(*)::text AS cnt
      FROM products p
      WHERE ${whereSql}
    `,
    params,
  );
  return Number.parseInt(res.rows[0]?.cnt ?? "0", 10) || 0;
}

export async function listProducts(
  filters: ListProductsFilter,
  limit: number,
  offset: number,
): Promise<ProductListItemDTO[]> {
  const { whereSql, params } = buildListWhere(filters);
  params.push(limit);
  params.push(offset);
  const limParam = `$${params.length - 1}`;
  const offParam = `$${params.length}`;

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
      FROM products p
      LEFT JOIN LATERAL (
        SELECT url FROM product_images pi2
        WHERE pi2.product_id = p.id
        ORDER BY pi2.sort_order ASC, pi2.created_at ASC
        LIMIT 1
      ) pi ON TRUE
      WHERE ${whereSql}
      ORDER BY p.featured DESC, p.updated_at DESC, p.created_at DESC
      LIMIT ${limParam} OFFSET ${offParam}
    `,
    params,
  );

  return result.rows.map((row) => {
    const tags = coerceTagNames(row.tag_names as unknown);
    return mapRowToListItem({ ...row, tag_names: tags });
  });
}

function detailWhereClause(mode: ProductDetailMode): string {
  if (mode === "public") {
    return `p.slug = $1 AND p.status = 'active' AND p.deleted_at IS NULL`;
  }
  return `p.slug = $1 AND p.deleted_at IS NULL`;
}

export async function getProductDetailBySlug(
  slug: string,
  mode: ProductDetailMode = "public",
): Promise<ProductDetailDTO | null> {
  const trimmed = slug.trim();
  if (!trimmed) return null;

  const head = await query<ProductDetailDbRow>(
    `
      SELECT
        p.id AS uuid,
        p.legacy_key,
        p.slug,
        p.title,
        p.description,
        p.group_name,
        p.price_vnd::text,
        p.featured,
        p.try_url,
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
      FROM products p
      LEFT JOIN LATERAL (
        SELECT url FROM product_images pi2
        WHERE pi2.product_id = p.id
        ORDER BY pi2.sort_order ASC, pi2.created_at ASC
        LIMIT 1
      ) pi ON TRUE
      WHERE ${detailWhereClause(mode)}
      LIMIT 1
    `,
    [trimmed],
  );

  const row = head.rows[0];
  if (!row) return null;

  const tags = coerceTagNames(row.tag_names as unknown);
  const base = mapRowToListItem({ ...row, tag_names: tags });

  const imgRes = await query<ProductImageDbRow>(
    `
      SELECT url, alt, sort_order
      FROM product_images
      WHERE product_id = $1::uuid
      ORDER BY sort_order ASC, created_at ASC
    `,
    [row.uuid],
  );

  return {
    ...base,
    description: row.description,
    try_url: row.try_url,
    images: imgRes.rows.map((r) => ({
      url: r.url,
      alt: r.alt,
      sort_order: r.sort_order,
    })),
  };
}

/** San pham lien quan: uu tien cung `group_name`, bo sung khac nhom. */
export async function listRelatedPublicProducts(
  excludeSlug: string,
  groupName: string,
  limit: number,
): Promise<ProductListItemDTO[]> {
  const ex = excludeSlug.trim();
  const gn = groupName.trim();
  if (!ex || limit <= 0) return [];

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
      FROM products p
      LEFT JOIN LATERAL (
        SELECT url FROM product_images pi2
        WHERE pi2.product_id = p.id
        ORDER BY pi2.sort_order ASC, pi2.created_at ASC
        LIMIT 1
      ) pi ON TRUE
      WHERE p.status = 'active'
        AND p.deleted_at IS NULL
        AND p.slug <> $1
      ORDER BY
        CASE WHEN p.group_name = $2 THEN 0 ELSE 1 END,
        p.featured DESC,
        p.updated_at DESC,
        p.created_at DESC
      LIMIT $3
    `,
    [ex, gn, limit],
  );

  return result.rows.map((r) => {
    const tags = coerceTagNames(r.tag_names as unknown);
    return mapRowToListItem({ ...r, tag_names: tags });
  });
}

export type ProductCatalogStats = {
  total: number;
  website: number;
  landing: number;
  categories: Record<string, number>;
};

/** Dem theo `group_name` cho sidebar (chi san pham public). */
export async function getPublicProductCatalogStats(): Promise<ProductCatalogStats> {
  const rows = await query<{ group_name: string; cnt: string }>(
    `
      SELECT group_name, COUNT(*)::text AS cnt
      FROM products p
      WHERE p.status = 'active' AND p.deleted_at IS NULL
      GROUP BY group_name
      ORDER BY group_name
    `,
  );

  let total = 0;
  const categories: Record<string, number> = {};
  for (const r of rows.rows) {
    const n = Number.parseInt(r.cnt, 10) || 0;
    categories[r.group_name] = n;
    total += n;
  }

  return {
    total,
    website: total,
    landing: 0,
    categories,
  };
}

