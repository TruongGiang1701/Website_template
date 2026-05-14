import { getAccessTokenMaxAgeSeconds, isValidAccessTokenShape } from "@/lib/jwt-decode";

export const ADMIN_SESSION_KEY = "admin_web_session";
export const ADMIN_ACCESS_COOKIE = "admin_web_at";

export type AdminUser = {
  id: string;
  email: string;
  name: string;
  role: "admin" | "staff" | "customer";
  avatar_url?: string | null;
};

export type AdminSession = {
  accessToken: string;
  refreshToken: string;
  user: AdminUser;
};

export function readAdminSession(): AdminSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(ADMIN_SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AdminSession;
    if (
      !parsed?.accessToken ||
      typeof parsed.accessToken !== "string" ||
      !parsed?.refreshToken ||
      typeof parsed.refreshToken !== "string" ||
      !parsed?.user?.email ||
      !parsed?.user?.role
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function writeAdminSession(session: AdminSession | null) {
  if (typeof window === "undefined") return;
  if (!session) {
    window.localStorage.removeItem(ADMIN_SESSION_KEY);
    document.cookie = `${ADMIN_ACCESS_COOKIE}=; path=/; max-age=0`;
    return;
  }
  window.localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
  syncAccessCookie(session.accessToken);
}

export function syncAccessCookie(accessToken: string) {
  if (typeof document === "undefined") return;
  const maxAge = getAccessTokenMaxAgeSeconds(accessToken);
  document.cookie = `${ADMIN_ACCESS_COOKIE}=${encodeURIComponent(accessToken)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

export function isAdminSession(session: AdminSession | null): boolean {
  if (!session?.accessToken) return false;
  if (!isValidAccessTokenShape(session.accessToken)) return false;
  return session.user.role === "admin";
}

type LoginApiSuccess = {
  ok: true;
  data: {
    accessToken: string;
    refreshToken: string;
    token?: string;
    user: AdminUser;
  };
};

type LoginApiFailure = {
  ok?: false;
  error?: string;
  message?: string;
};

function parseError(json: unknown, fallback: string) {
  const j = json as LoginApiFailure;
  return (
    (typeof j?.error === "string" && j.error) ||
    (typeof j?.message === "string" && j.message) ||
    fallback
  );
}

export async function loginAdmin(
  email: string,
  password: string,
): Promise<{ ok: true } | { ok: false; message: string }> {
  try {
    const res = await fetch("/api/auth/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim(), password }),
    });
    const json = (await res.json()) as LoginApiSuccess | LoginApiFailure;
    if (!res.ok || !json || !("ok" in json) || !json.ok || !("data" in json)) {
      return { ok: false, message: parseError(json, "Đăng nhập thất bại.") };
    }
    const accessToken =
      json.data.accessToken?.trim() ||
      (typeof json.data.token === "string" ? json.data.token.trim() : "");
    if (!accessToken || !json.data.refreshToken?.trim()) {
      return { ok: false, message: "Phản hồi xác thực không hợp lệ." };
    }
    if (json.data.user.role !== "admin") {
      return { ok: false, message: "Chỉ tài khoản admin mới được vào trang quản trị." };
    }
    const session: AdminSession = {
      accessToken,
      refreshToken: json.data.refreshToken.trim(),
      user: json.data.user,
    };
    writeAdminSession(session);
    return { ok: true };
  } catch {
    return { ok: false, message: "Không kết nối được tới máy chủ." };
  }
}

export function logoutAdmin() {
  writeAdminSession(null);
}
