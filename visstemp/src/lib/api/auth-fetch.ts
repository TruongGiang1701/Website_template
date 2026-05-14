import {
  logoutLocalUser,
  readSession,
  refreshWithApi,
} from "@/app/(auth)/_components/auth-storage";

type RefreshResult = { ok: true } | { ok: false; message: string };

let refreshInFlight: Promise<RefreshResult> | null = null;

function normalizeBearer(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  return trimmed.toLowerCase().startsWith("bearer ")
    ? trimmed
    : `Bearer ${trimmed}`;
}

function currentBearerToken(explicitToken?: string): string {
  if (typeof explicitToken === "string" && explicitToken.trim()) {
    return normalizeBearer(explicitToken);
  }
  const accessToken = readSession()?.accessToken?.trim() ?? "";
  return normalizeBearer(accessToken);
}

async function refreshAccessTokenOnce(): Promise<RefreshResult> {
  if (!refreshInFlight) {
    refreshInFlight = (async () => {
      const refreshed = await refreshWithApi();
      if (!refreshed.ok) {
        logoutLocalUser();
      }
      return refreshed;
    })().finally(() => {
      refreshInFlight = null;
    });
  }
  return refreshInFlight;
}

type AuthedFetchOptions = {
  token?: string;
  requireAuth?: boolean;
};

/**
 * Send request with Bearer token, auto refresh on 401 and retry once.
 * - `requireAuth=true`: throws if no token / refresh failed.
 * - `requireAuth=false`: allows anonymous requests (e.g. cart guest flow).
 */
export async function fetchWithAutoRefresh(
  input: RequestInfo | URL,
  init: RequestInit,
  options: AuthedFetchOptions = {},
): Promise<Response> {
  const requireAuth = options.requireAuth ?? false;

  const call = (bearer: string) => {
    const headers = new Headers(init.headers ?? {});
    if (bearer) headers.set("Authorization", bearer);
    return fetch(input, {
      ...init,
      credentials: init.credentials ?? "same-origin",
      headers,
    });
  };

  let bearer = currentBearerToken(options.token);
  if (requireAuth && !bearer) {
    throw new Error("Vui lòng đăng nhập lại.");
  }

  let res = await call(bearer);
  if (res.status !== 401) return res;

  const refreshed = await refreshAccessTokenOnce();
  if (!refreshed.ok) {
    if (requireAuth) throw new Error(refreshed.message);
    return res;
  }

  bearer = currentBearerToken();
  if (requireAuth && !bearer) {
    throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
  }
  if (!bearer) return res;

  res = await call(bearer);
  return res;
}

