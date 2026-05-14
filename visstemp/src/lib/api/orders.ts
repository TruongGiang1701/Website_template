import type { OrderDetailDTO, OrderListItemDTO } from "@/types/orders";
import { fetchWithAutoRefresh } from "@/lib/api/auth-fetch";

type ApiOk<T> = { ok: true; data: T };
type ApiErr = { ok?: false; error?: string; message?: string; statusCode?: number };

const ORDERS_BASE = "/api/orders";
const CART_MERGE = "/api/cart/merge";

function readBearerToken(authToken: string): string {
  const trimmed = authToken.trim();
  if (!trimmed) return "";
  return trimmed.toLowerCase().startsWith("bearer ") ? trimmed : `Bearer ${trimmed}`;
}

function asApiError(json: ApiErr | unknown, fallback: string): Error {
  const j = json as ApiErr;
  return new Error(
    (j && typeof j.error === "string" && j.error) ||
      (j && typeof j.message === "string" && j.message) ||
      fallback,
  );
}

async function parseOk<T>(res: Response, fallback: string): Promise<T> {
  let json: ApiOk<T> | ApiErr = {};
  try {
    json = (await res.json()) as ApiOk<T> | ApiErr;
  } catch {
    throw new Error(`${fallback} (HTTP ${res.status})`);
  }
  if (!res.ok || !json || !("ok" in json) || !json.ok || !("data" in json)) {
    throw asApiError(json, fallback);
  }
  return json.data;
}

export type CreateOrderPayload = {
  contact_name?: string;
  contact_email?: string;
  note?: string;
};

export async function mergeCartAfterLogin(authToken: string): Promise<void> {
  const bearer = readBearerToken(authToken);
  if (!bearer) throw new Error("Thiếu access token.");
  const res = await fetchWithAutoRefresh(
    CART_MERGE,
    {
      method: "POST",
      credentials: "same-origin",
      headers: {},
    },
    { requireAuth: true, token: bearer },
  );
  await parseOk(res, "Không gộp được giỏ hàng sau đăng nhập.");
}

export async function createOrder(
  authToken: string,
  payload: CreateOrderPayload,
): Promise<OrderDetailDTO> {
  const bearer = readBearerToken(authToken);
  if (!bearer) throw new Error("Thiếu access token.");
  const res = await fetchWithAutoRefresh(
    ORDERS_BASE,
    {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
    { requireAuth: true, token: bearer },
  );
  return parseOk<OrderDetailDTO>(res, "Không tạo được đơn hàng.");
}

export async function listOrders(authToken: string): Promise<OrderListItemDTO[]> {
  const bearer = readBearerToken(authToken);
  if (!bearer) throw new Error("Thiếu access token.");
  const res = await fetchWithAutoRefresh(
    ORDERS_BASE,
    {
      method: "GET",
      credentials: "same-origin",
      headers: {},
      cache: "no-store",
    },
    { requireAuth: true, token: bearer },
  );
  return parseOk<OrderListItemDTO[]>(res, "Không tải được lịch sử đơn hàng.");
}

export async function getOrderByCode(
  authToken: string,
  code: string,
): Promise<OrderDetailDTO> {
  const bearer = readBearerToken(authToken);
  if (!bearer) throw new Error("Thiếu access token.");
  const safeCode = encodeURIComponent(code.trim());
  const res = await fetchWithAutoRefresh(
    `${ORDERS_BASE}/${safeCode}`,
    {
      method: "GET",
      credentials: "same-origin",
      headers: {},
      cache: "no-store",
    },
    { requireAuth: true, token: bearer },
  );
  return parseOk<OrderDetailDTO>(res, "Không tải được chi tiết đơn hàng.");
}
