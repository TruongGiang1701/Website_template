import type { GuestCartDTO } from "@/types/cart";
import { fetchWithAutoRefresh } from "@/lib/api/auth-fetch";

const CART_BASE = "/api/cart";
const CART_ITEMS = `${CART_BASE}/items`;

type CartJson = { ok?: boolean; data?: GuestCartDTO; error?: string; message?: string };

async function parseCartJson(res: Response): Promise<GuestCartDTO> {
  let json: CartJson = {};
  try {
    json = (await res.json()) as CartJson;
  } catch {
    throw new Error(`Giỏ hàng không phản hồi hợp lệ (HTTP ${res.status})`);
  }
  if (!res.ok || !json.ok || !json.data) {
    throw new Error(
      json.error ||
        json.message ||
        `Giỏ hàng không phản hồi hợp lệ (HTTP ${res.status})`,
    );
  }
  return json.data;
}

/** GET /api/cart — nếu đã login thì trả giỏ theo user, chưa login thì theo cookie guest. */
export async function fetchCart(): Promise<GuestCartDTO> {
  const res = await fetchWithAutoRefresh(CART_BASE, {
    cache: "no-store",
    credentials: "same-origin",
    headers: {},
  });
  return parseCartJson(res);
}

/** POST /api/cart/items — ghi vào giỏ user nếu đã login, không thì vào giỏ guest. */
export async function upsertCartItem(
  productId: string,
  qty: number,
): Promise<GuestCartDTO> {
  const res = await fetchWithAutoRefresh(CART_ITEMS, {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId, qty }),
  });
  return parseCartJson(res);
}

/** DELETE /api/cart/items?productId= */
export async function deleteCartItem(productId: string): Promise<GuestCartDTO> {
  const sp = new URLSearchParams();
  sp.set("productId", productId);
  const res = await fetchWithAutoRefresh(`${CART_ITEMS}?${sp.toString()}`, {
    method: "DELETE",
    credentials: "same-origin",
    headers: {},
  });
  return parseCartJson(res);
}

// Backward-compatible aliases (guest-only naming from older UI code).
export const fetchGuestCart = fetchCart;
export const upsertGuestCartItem = upsertCartItem;
export const deleteGuestCartItem = deleteCartItem;
