import { readAdminSession, refreshAdminSession } from "@/lib/auth-storage";

export type AdminApiResult<T> =
  | { ok: true; data: T; status: number }
  | { ok: false; error: string; status: number };

/**
 * Gọi API admin qua rewrite Next (`/api/...` → backend). Luôn gửi Bearer access token nếu có.
 * Tự động refresh token nếu API trả về 401.
 */
export async function adminApiJson<T>(path: string, init?: RequestInit): Promise<AdminApiResult<T>> {
  const session = typeof window !== "undefined" ? readAdminSession() : null;
  let token = session?.accessToken?.trim();

  const baseHeaders = new Headers(init?.headers);
  const isFormData =
    typeof FormData !== "undefined" && init?.body != null && init.body instanceof FormData;
  if (!isFormData && !baseHeaders.has("Content-Type") && init?.body != null) {
    baseHeaders.set("Content-Type", "application/json");
  }

  const buildHeaders = (accessToken?: string) => {
    const h = new Headers(baseHeaders);
    if (accessToken) h.set("Authorization", `Bearer ${accessToken}`);
    return h;
  };

  try {
    let res = await fetch(path, { ...init, headers: buildHeaders(token) });

    if (res.status === 401 && session?.refreshToken) {
      const refreshed = await refreshAdminSession();
      if (refreshed) {
        const newSession = readAdminSession();
        if (newSession?.accessToken) {
          res = await fetch(path, { ...init, headers: buildHeaders(newSession.accessToken) });
        }
      }
    }

    const text = await res.text();
    let json: unknown = {};
    if (text) {
      try {
        json = JSON.parse(text) as unknown;
      } catch {
        json = {};
      }
    }

    if (!res.ok) {
      const j = json as { error?: string; message?: string };
      const err =
        (typeof j?.error === "string" && j.error) ||
        (typeof j?.message === "string" && j.message) ||
        `Lỗi ${res.status}`;
      return { ok: false, error: err, status: res.status };
    }

    const j = json as { ok?: boolean; data?: unknown };
    if (!j || j.ok !== true || !("data" in j)) {
      return { ok: false, error: "Phản hồi API không hợp lệ (thiếu data).", status: res.status };
    }
    return { ok: true, data: j.data as T, status: res.status };
  } catch {
    return { ok: false, error: "Không kết nối được tới máy chủ.", status: 0 };
  }
}
