import type { ProductListItemDTO } from "@/types/products";
import { fetchWithAutoRefresh } from "@/lib/api/auth-fetch";

const FAVORITES_BASE = "/api/favorites";

type ListJson = {
  ok?: boolean;
  data?: ProductListItemDTO[];
  error?: string;
  message?: string;
};

function parseList(res: Response, json: ListJson): ProductListItemDTO[] {
  if (!res.ok || !json.ok || !Array.isArray(json.data)) {
    throw new Error(
      json.error ||
        json.message ||
        `Yêu thích không phản hồi hợp lệ (HTTP ${res.status})`,
    );
  }
  return json.data;
}

/** GET /api/favorites — yêu cầu đăng nhập. */
export async function fetchFavorites(): Promise<ProductListItemDTO[]> {
  const res = await fetchWithAutoRefresh(
    FAVORITES_BASE,
    {
    cache: "no-store",
    credentials: "same-origin",
      headers: {},
    },
    { requireAuth: true },
  );
  const json = (await res.json()) as ListJson;
  return parseList(res, json);
}

/** POST /api/favorites — trả về danh sách đầy đủ sau khi thêm. */
export async function addFavoriteApi(productId: string): Promise<ProductListItemDTO[]> {
  const res = await fetchWithAutoRefresh(
    FAVORITES_BASE,
    {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    },
    { requireAuth: true },
  );
  const json = (await res.json()) as ListJson;
  return parseList(res, json);
}

/** DELETE /api/favorites/:productId — trả về danh sách đầy đủ sau khi xóa. */
export async function removeFavoriteApi(
  productId: string,
): Promise<ProductListItemDTO[]> {
  const path = `${FAVORITES_BASE}/${encodeURIComponent(productId)}`;
  const res = await fetchWithAutoRefresh(
    path,
    {
      method: "DELETE",
      credentials: "same-origin",
      headers: {},
    },
    { requireAuth: true },
  );
  const json = (await res.json()) as ListJson;
  return parseList(res, json);
}
