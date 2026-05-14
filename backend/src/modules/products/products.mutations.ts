import type { PoolClient } from "pg";
import { getDbPool } from "@/lib/db";
import type { ProductDetailDTO } from "@/types/products";
import { getProductDetailBySlug } from "./products.repository";
import { slugifyTag } from "./products.slug";

export class ProductMutationError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
  ) {
    super(message);
    this.name = "ProductMutationError";
  }
}

export type CreateProductInput = {
  title: string;
  slug: string;
  group_name: string;
  price_vnd: number;
  featured?: boolean;
  description?: string | null;
  try_url?: string | null;
  legacy_key?: string | null;
  status?: "draft" | "active" | "archived";
  tag_names?: string[];
  image_urls?: string[];
};

export type UpdateProductInput = {
  title?: string;
  slug?: string;
  group_name?: string;
  price_vnd?: number;
  featured?: boolean;
  description?: string | null;
  try_url?: string | null;
  legacy_key?: string | null;
  status?: "draft" | "active" | "archived";
  tag_names?: string[];
  image_urls?: string[];
  restore?: boolean;
};

function normalizeStrings(arr: unknown): string[] {
  if (!Array.isArray(arr)) return [];
  const out = new Set<string>();
  for (const x of arr) {
    if (typeof x !== "string") continue;
    const t = x.trim();
    if (t.length > 0) out.add(t);
  }
  return Array.from(out);
}

function normalizeUrls(arr: unknown): string[] {
  if (!Array.isArray(arr)) return [];
  const out: string[] = [];
  for (const x of arr) {
    if (typeof x !== "string") continue;
    const t = x.trim();
    if (t.length > 0) out.push(t);
  }
  return out;
}

async function upsertTagId(client: PoolClient, name: string): Promise<string> {
  const slug = slugifyTag(name);
  if (!slug) throw new ProductMutationError("Tên tag không hợp lệ", 400);
  const res = await client.query<{ id: string }>(
    `
      INSERT INTO tags (name, slug)
      VALUES ($1, $2)
      ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
      RETURNING id
    `,
    [name.trim(), slug],
  );
  const id = res.rows[0]?.id;
  if (!id) throw new ProductMutationError("Không tạo được tag", 500);
  return id;
}

async function replaceTags(client: PoolClient, productId: string, names: string[]) {
  await client.query(`DELETE FROM product_tags WHERE product_id = $1::uuid`, [
    productId,
  ]);
  for (const name of names) {
    const tagId = await upsertTagId(client, name);
    await client.query(
      `
        INSERT INTO product_tags (product_id, tag_id)
        VALUES ($1::uuid, $2::uuid)
        ON CONFLICT DO NOTHING
      `,
      [productId, tagId],
    );
  }
}

async function replaceImages(client: PoolClient, productId: string, urls: string[]) {
  await client.query(`DELETE FROM product_images WHERE product_id = $1::uuid`, [
    productId,
  ]);
  let idx = 0;
  for (const url of urls) {
    await client.query(
      `
        INSERT INTO product_images (product_id, url, alt, sort_order)
        VALUES ($1::uuid, $2, NULL, $3)
      `,
      [productId, url, idx],
    );
    idx += 1;
  }
}

export async function createProduct(
  raw: Record<string, unknown>,
): Promise<ProductDetailDTO> {
  const title = typeof raw.title === "string" ? raw.title.trim() : "";
  const slug = typeof raw.slug === "string" ? raw.slug.trim() : "";
  const group_name = typeof raw.group_name === "string" ? raw.group_name.trim() : "";

  let price_vnd =
    typeof raw.price_vnd === "number"
      ? raw.price_vnd
      : typeof raw.price_vnd === "string"
        ? Number.parseInt(raw.price_vnd, 10)
        : NaN;
  if (!Number.isFinite(price_vnd) || price_vnd < 0) {
    throw new ProductMutationError("price_vnd phải là số nguyên >= 0", 400);
  }
  price_vnd = Math.floor(price_vnd);

  if (!title || !slug || !group_name) {
    throw new ProductMutationError("Thiếu title, slug hoặc group_name", 400);
  }

  const featured = raw.featured === true;
  const description =
    raw.description === null || raw.description === undefined
      ? null
      : typeof raw.description === "string"
        ? raw.description
        : null;
  const try_url =
    raw.try_url === null || raw.try_url === undefined
      ? null
      : typeof raw.try_url === "string"
        ? raw.try_url.trim() || null
        : null;
  const legacy_key =
    raw.legacy_key === null || raw.legacy_key === undefined
      ? null
      : typeof raw.legacy_key === "string"
        ? raw.legacy_key.trim() || null
        : null;

  const statusRaw = raw.status;
  const status =
    statusRaw === "draft" || statusRaw === "active" || statusRaw === "archived"
      ? statusRaw
      : "active";

  const tag_names = normalizeStrings(raw.tag_names);
  const image_urls = normalizeUrls(raw.image_urls);

  const pool = getDbPool();
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    let productId = "";
    try {
      const inserted = await client.query<{ id: string }>(
        `
          INSERT INTO products (
            legacy_key, title, slug, description, group_name,
            price_vnd, featured, status, try_url, deleted_at
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NULL)
          RETURNING id
        `,
        [
          legacy_key,
          title,
          slug,
          description,
          group_name,
          price_vnd,
          featured,
          status,
          try_url,
        ],
      );
      productId = inserted.rows[0]?.id ?? "";
    } catch (e: unknown) {
      const code =
        typeof e === "object" && e && "code" in e
          ? String((e as { code: unknown }).code)
          : "";
      if (code === "23505") {
        throw new ProductMutationError("Trùng slug hoặc legacy_key (unique)", 409);
      }
      throw e;
    }

    if (!productId) throw new ProductMutationError("Không tạo được sản phẩm", 500);
    if (tag_names.length > 0) await replaceTags(client, productId, tag_names);
    if (image_urls.length > 0) await replaceImages(client, productId, image_urls);

    await client.query("COMMIT");
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }

  const detail = await getProductDetailBySlug(slug, "manage");
  if (!detail) throw new ProductMutationError("Đã tạo nhưng không đọc lại được", 500);
  return detail;
}

export async function updateProductBySlug(
  pathSlug: string,
  raw: Record<string, unknown>,
): Promise<ProductDetailDTO> {
  const currentSlug = pathSlug.trim();
  if (!currentSlug) throw new ProductMutationError("Thiếu slug", 400);

  const pool = getDbPool();
  const client = await pool.connect();
  let finalSlugForRead = currentSlug;

  try {
    await client.query("BEGIN");

    const found = await client.query<{ id: string; slug: string }>(
      `SELECT id, slug FROM products WHERE slug = $1 LIMIT 1`,
      [currentSlug],
    );
    const row0 = found.rows[0];
    if (!row0) throw new ProductMutationError("Không tìm thấy sản phẩm", 404);
    const productId = row0.id;

    const sets: string[] = [];
    const params: unknown[] = [];
    const pushSet = (col: string, val: unknown) => {
      params.push(val);
      sets.push(`${col} = $${params.length}`);
    };

    if (typeof raw.title === "string" && raw.title.trim()) pushSet("title", raw.title.trim());
    if (typeof raw.slug === "string" && raw.slug.trim()) {
      pushSet("slug", raw.slug.trim());
      finalSlugForRead = raw.slug.trim();
    }
    if (typeof raw.group_name === "string" && raw.group_name.trim())
      pushSet("group_name", raw.group_name.trim());

    if (typeof raw.price_vnd === "number" || typeof raw.price_vnd === "string") {
      const pv =
        typeof raw.price_vnd === "number"
          ? raw.price_vnd
          : Number.parseInt(raw.price_vnd, 10);
      if (!Number.isFinite(pv) || pv < 0) throw new ProductMutationError("price_vnd không hợp lệ", 400);
      pushSet("price_vnd", Math.floor(pv));
    }

    if (typeof raw.featured === "boolean") pushSet("featured", raw.featured);
    if ("description" in raw) {
      if (raw.description === null) pushSet("description", null);
      else if (typeof raw.description === "string") pushSet("description", raw.description);
    }
    if ("try_url" in raw) {
      if (raw.try_url === null) pushSet("try_url", null);
      else if (typeof raw.try_url === "string") pushSet("try_url", raw.try_url.trim() || null);
    }
    if ("legacy_key" in raw) {
      if (raw.legacy_key === null) pushSet("legacy_key", null);
      else if (typeof raw.legacy_key === "string") pushSet("legacy_key", raw.legacy_key.trim() || null);
    }
    if (raw.status === "draft" || raw.status === "active" || raw.status === "archived")
      pushSet("status", raw.status);
    if (raw.restore === true) pushSet("deleted_at", null);

    if (sets.length > 0) {
      params.push(productId);
      const idParam = `$${params.length}`;
      try {
        await client.query(
          `UPDATE products SET ${sets.join(", ")} WHERE id = ${idParam}::uuid`,
          params,
        );
      } catch (e: unknown) {
        const code =
          typeof e === "object" && e && "code" in e
            ? String((e as { code: unknown }).code)
            : "";
        if (code === "23505") {
          throw new ProductMutationError("Trùng slug hoặc legacy_key (unique)", 409);
        }
        throw e;
      }
    }

    if (raw.tag_names !== undefined) {
      await replaceTags(client, productId, normalizeStrings(raw.tag_names));
    }
    if (raw.image_urls !== undefined) {
      await replaceImages(client, productId, normalizeUrls(raw.image_urls));
    }

    await client.query("COMMIT");
  } catch (e) {
    await client.query("ROLLBACK").catch(() => {});
    throw e;
  } finally {
    client.release();
  }

  const detail = await getProductDetailBySlug(finalSlugForRead, "manage");
  if (!detail) {
    throw new ProductMutationError("Đã cập nhật nhưng không đọc lại được", 500);
  }
  return detail;
}

export async function softDeleteProductBySlug(
  slug: string,
): Promise<{ uuid: string; slug: string }> {
  const s = slug.trim();
  if (!s) throw new ProductMutationError("Thiếu slug", 400);

  const pool = getDbPool();
  const res = await pool.query<{ id: string; slug: string }>(
    `
      UPDATE products
      SET deleted_at = now()
      WHERE slug = $1 AND deleted_at IS NULL
      RETURNING id, slug
    `,
    [s],
  );

  const row = res.rows[0];
  if (!row) throw new ProductMutationError("Không tìm thấy sản phẩm", 404);
  return { uuid: row.id, slug: row.slug };
}

