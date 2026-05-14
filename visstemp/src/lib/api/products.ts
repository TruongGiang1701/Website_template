/**
 * HTTP client cho các Route Handler `/api/products/*`.
 * Gom một chỗ để dễ tìm và mở rộng (auth header, base URL, v.v.).
 */

import type { ProductListItemDTO } from "@/types/products";

export type ProductsListMeta = {
  page: number;
  limit: number;
  total: number;
  pageCount: number;
};

export type ProductsListResponse = {
  ok: boolean;
  data?: ProductListItemDTO[];
  meta?: ProductsListMeta;
  error?: string;
};

export type ProductsCatalogMeta = {
  total: number;
  website: number;
  landing: number;
  categories: Record<string, number>;
};

export type ProductsMetaResponse = {
  ok: boolean;
  data?: ProductsCatalogMeta;
  error?: string;
};

const PRODUCTS_BASE = "/api/products";

/** Thống kê sidebar: tổng + đếm theo `group_name`. */
export async function getProductsCatalogMeta(): Promise<ProductsCatalogMeta> {
  const res = await fetch(`${PRODUCTS_BASE}/meta`, { cache: "no-store" });
  const json = (await res.json()) as ProductsMetaResponse;
  if (!res.ok || !json.ok || !json.data) {
    throw new Error(json.error || "Không tải được thống kê catalog");
  }
  return json.data;
}

export type GetProductsListParams = {
  page: number;
  limit: number;
  q?: string;
  groups?: string[];
  price?: "under_10m" | "10m_15m" | "promo" | null;
  signal?: AbortSignal;
};

/** Danh sách phân trang + filter (khớp query `GET /api/products`). */
export async function getProductsList(params: GetProductsListParams): Promise<{
  items: ProductListItemDTO[];
  meta: ProductsListMeta;
}> {
  const sp = new URLSearchParams();
  sp.set("page", String(params.page));
  sp.set("limit", String(params.limit));
  if (params.q?.trim()) sp.set("q", params.q.trim());
  if (params.groups && params.groups.length > 0) {
    sp.set("groups", params.groups.join(","));
  }
  if (params.price) sp.set("price", params.price);

  const res = await fetch(`${PRODUCTS_BASE}?${sp.toString()}`, {
    cache: "no-store",
    signal: params.signal,
  });
  const json = (await res.json()) as ProductsListResponse;
  if (!res.ok || !json.ok || !json.data || !json.meta) {
    throw new Error(json.error || "Không tải được danh sách sản phẩm");
  }
  return { items: json.data, meta: json.meta };
}
