import {
  accessTokenExpiresInMs,
  getAccessTokenMaxAgeSeconds,
  getRefreshTokenMaxAgeSeconds,
  isValidAccessTokenShape,
  isValidRefreshTokenShape,
} from "@/lib/jwt-decode";

export const ADMIN_SESSION_KEY = "admin_web_session";
export const ADMIN_ACCESS_COOKIE = "admin_web_at";
/** Cookie refresh để middleware cho phép vào app khi access hết hạn (client sẽ refresh). */
export const ADMIN_REFRESH_COOKIE = "admin_web_rt";

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

function setCookie(name: string, value: string, maxAgeSec: number) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAgeSec}; SameSite=Lax`;
}

function clearCookie(name: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; path=/; max-age=0`;
}

export function syncAccessCookie(accessToken: string) {
  setCookie(ADMIN_ACCESS_COOKIE, accessToken, getAccessTokenMaxAgeSeconds(accessToken));
}

export function syncRefreshCookie(refreshToken: string) {
  setCookie(ADMIN_REFRESH_COOKIE, refreshToken, getRefreshTokenMaxAgeSeconds(refreshToken));
}

export function writeAdminSession(session: AdminSession | null) {
  if (typeof window === "undefined") return;
  if (!session) {
    window.localStorage.removeItem(ADMIN_SESSION_KEY);
    clearCookie(ADMIN_ACCESS_COOKIE);
    clearCookie(ADMIN_REFRESH_COOKIE);
    return;
  }
  window.localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
  syncAccessCookie(session.accessToken);
  syncRefreshCookie(session.refreshToken);
}

export function isAdminSession(session: AdminSession | null): boolean {
  if (!session?.accessToken) return false;
  if (!isValidAccessTokenShape(session.accessToken)) return false;
  return session.user.role === "admin";
}

/** Access hết hạn nhưng refresh còn hạn — có thể gọi POST /api/auth/refresh. */
export function canRestoreAdminSession(session: AdminSession | null): boolean {
  if (!session?.refreshToken?.trim()) return false;
  if (session.user.role !== "admin") return false;
  return isValidRefreshTokenShape(session.refreshToken);
}

let refreshInFlight: Promise<boolean> | null = null;

/**
 * Đổi refresh → access + refresh mới (rotation). Cập nhật localStorage + cookies.
 */
export async function refreshAdminSession(): Promise<boolean> {
  if (refreshInFlight) return refreshInFlight;

  refreshInFlight = (async () => {
    const session = readAdminSession();
    const refreshToken = session?.refreshToken?.trim();
    if (!refreshToken) return false;

    try {
      const res = await fetch("/api/auth/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });
      const json = (await res.json()) as {
        ok?: boolean;
        data?: {
          accessToken?: string;
          token?: string;
          refreshToken?: string;
          user?: AdminUser;
        };
      };

      if (!res.ok || !json?.ok || !json.data) {
        writeAdminSession(null);
        return false;
      }

      const accessToken =
        json.data.accessToken?.trim() ||
        (typeof json.data.token === "string" ? json.data.token.trim() : "");
      if (!accessToken) {
        writeAdminSession(null);
        return false;
      }

      const nextRefresh = json.data.refreshToken?.trim() || refreshToken;
      writeAdminSession({
        accessToken,
        refreshToken: nextRefresh,
        user: json.data.user ?? session!.user,
      });
      return true;
    } catch {
      writeAdminSession(null);
      return false;
    }
  })().finally(() => {
    refreshInFlight = null;
  });

  return refreshInFlight;
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
    writeAdminSession({
      accessToken,
      refreshToken: json.data.refreshToken.trim(),
      user: json.data.user,
    });
    return { ok: true };
  } catch {
    return { ok: false, message: "Không kết nối được tới máy chủ." };
  }
}

export function logoutAdmin() {
  writeAdminSession(null);
}

/** Lên lịch refresh access ~1 phút trước khi hết hạn (gọi từ AuthGuard). */
export function scheduleAccessTokenRefresh(): () => void {
  const session = readAdminSession();
  if (!session?.accessToken) return () => {};

  const ms = accessTokenExpiresInMs(session.accessToken);
  const refreshIn = Math.max(0, ms - 60_000);
  if (refreshIn === 0 && canRestoreAdminSession(session)) {
    void refreshAdminSession();
    return () => {};
  }

  const timer = window.setTimeout(() => {
    void refreshAdminSession();
  }, refreshIn);

  return () => window.clearTimeout(timer);
}
