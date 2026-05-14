export type LocalUser = {
  name: string;
  email: string;
  password: string;
};

export type LocalSession = {
  userId?: string;
  email: string;
  name: string;
  at: number;
  accessToken?: string;
  refreshToken?: string;
  tokenType?: string;
};

export type UserSettings = {
  displayName: string;
  preferredCategory: string;
  notifyPromotions: boolean;
  notifyOrderUpdates: boolean;
  showProfilePublic: boolean;
};

const USERS_KEY = "visstemp_auth_users";
export const SESSION_KEY = "visstemp_auth_session";
const SETTINGS_KEY = "visstemp_user_settings";

export function readUsers(): LocalUser[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(USERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as LocalUser[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export function writeUsers(users: LocalUser[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function writeSession(session: LocalSession | null) {
  if (typeof window === "undefined") return;
  if (!session) {
    window.localStorage.removeItem(SESSION_KEY);
  } else {
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }
  window.dispatchEvent(new Event("visstemp-auth-changed"));
}

export type AuthTokensPayload = {
  accessToken: string;
  refreshToken: string;
  token?: string;
  tokenType?: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
};

type AuthApiSuccess = {
  ok: true;
  data: AuthTokensPayload;
};

type AuthApiFailure = {
  ok?: false;
  error?: string;
  message?: string;
};

function persistAuthTokens(data: AuthTokensPayload) {
  const token =
    typeof data.accessToken === "string" && data.accessToken.trim()
      ? data.accessToken
      : typeof data.token === "string" && data.token.trim()
        ? data.token
        : "";
  if (!token || !data.user?.email || !data.user?.name) {
    return { ok: false as const, message: "Phản hồi xác thực không hợp lệ." };
  }
  if (typeof data.refreshToken !== "string" || !data.refreshToken.trim()) {
    return { ok: false as const, message: "Thiếu refresh token từ máy chủ." };
  }

  writeSession({
    userId: data.user.id,
    email: data.user.email,
    name: data.user.name,
    at: Date.now(),
    accessToken: token,
    refreshToken: data.refreshToken,
    tokenType: data.tokenType ?? "Bearer",
  });
  return { ok: true as const };
}

function parseAuthFailure(json: AuthApiFailure | unknown, fallback: string) {
  const j = json as AuthApiFailure;
  return (
    (j && typeof j.error === "string" && j.error) ||
    (j && typeof j.message === "string" && j.message) ||
    fallback
  );
}

async function authPost(
  endpoint: "login" | "register",
  payload: Record<string, unknown>,
): Promise<{ ok: true } | { ok: false; message: string }> {
  try {
    const res = await fetch(`/api/auth/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = (await res.json()) as AuthApiSuccess | AuthApiFailure;
    if (!res.ok || !json || !("ok" in json) || !json.ok || !("data" in json)) {
      return {
        ok: false,
        message: parseAuthFailure(json, "Không thể kết nối dịch vụ xác thực."),
      };
    }

    const persisted = persistAuthTokens(json.data);
    if (!persisted.ok) return persisted;
    return { ok: true };
  } catch {
    return { ok: false, message: "Không kết nối được tới máy chủ." };
  }
}

export function readSession(): LocalSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as LocalSession;
    if (!parsed || typeof parsed.email !== "string" || typeof parsed.name !== "string") {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function logoutLocalUser() {
  writeSession(null);
}

export function updateCurrentSessionName(name: string) {
  const session = readSession();
  if (!session) return;
  writeSession({ ...session, name });
}

export function readUserSettings(email: string): UserSettings {
  const fallback: UserSettings = {
    displayName: email.split("@")[0] || "Người dùng",
    preferredCategory: "Doanh nghiệp",
    notifyPromotions: true,
    notifyOrderUpdates: true,
    showProfilePublic: false,
  };
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(SETTINGS_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as Record<string, Partial<UserSettings>>;
    const current = parsed?.[email];
    if (!current) return fallback;
    return {
      displayName:
        typeof current.displayName === "string" && current.displayName.trim()
          ? current.displayName
          : fallback.displayName,
      preferredCategory:
        typeof current.preferredCategory === "string" &&
        current.preferredCategory.trim()
          ? current.preferredCategory
          : fallback.preferredCategory,
      notifyPromotions:
        typeof current.notifyPromotions === "boolean"
          ? current.notifyPromotions
          : fallback.notifyPromotions,
      notifyOrderUpdates:
        typeof current.notifyOrderUpdates === "boolean"
          ? current.notifyOrderUpdates
          : fallback.notifyOrderUpdates,
      showProfilePublic:
        typeof current.showProfilePublic === "boolean"
          ? current.showProfilePublic
          : fallback.showProfilePublic,
    };
  } catch {
    return fallback;
  }
}

export function writeUserSettings(email: string, settings: UserSettings) {
  if (typeof window === "undefined") return;
  let parsed: Record<string, UserSettings> = {};
  try {
    const raw = window.localStorage.getItem(SETTINGS_KEY);
    parsed = raw ? (JSON.parse(raw) as Record<string, UserSettings>) : {};
  } catch {
    parsed = {};
  }
  parsed[email] = settings;
  window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(parsed));
  window.dispatchEvent(new Event("visstemp-auth-changed"));
}

export function registerLocalUser(
  user: LocalUser,
): { ok: true } | { ok: false; message: string } {
  const users = readUsers();
  const normalizedEmail = user.email.trim().toLowerCase();
  const exists = users.some((u) => u.email.trim().toLowerCase() === normalizedEmail);
  if (exists) {
    return { ok: false, message: "Email này đã được đăng ký." };
  }
  writeUsers([
    ...users,
    {
      ...user,
      name: user.name.trim(),
      email: normalizedEmail,
    },
  ]);
  return { ok: true };
}

export async function registerWithApi(
  user: Pick<LocalUser, "name" | "email" | "password">,
): Promise<{ ok: true } | { ok: false; message: string }> {
  return authPost("register", {
    name: user.name.trim(),
    email: user.email.trim(),
    password: user.password,
  });
}

export function loginLocalUser(
  email: string,
  password: string,
): { ok: true } | { ok: false; message: string } {
  const users = readUsers();
  const match = users.find(
    (u) =>
      u.email.trim().toLowerCase() === email.trim().toLowerCase() &&
      u.password === password,
  );
  if (!match) {
    return { ok: false, message: "Email hoặc mật khẩu không đúng." };
  }
  writeSession({ email: match.email, name: match.name, at: Date.now() });
  return { ok: true };
}

export async function loginWithApi(
  email: string,
  password: string,
): Promise<{ ok: true } | { ok: false; message: string }> {
  return authPost("login", {
    email: email.trim(),
    password,
  });
}

/** POST /api/auth/refresh — rotation refresh token, cập nhật session local. */
export async function refreshWithApi(): Promise<
  { ok: true } | { ok: false; message: string }
> {
  const session = readSession();
  const refreshToken = session?.refreshToken?.trim();
  if (!refreshToken) {
    return { ok: false, message: "Chưa có refresh token. Vui lòng đăng nhập lại." };
  }
  try {
    const res = await fetch(`/api/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    const json = (await res.json()) as AuthApiSuccess | AuthApiFailure;
    if (!res.ok || !json || !("ok" in json) || !json.ok || !("data" in json)) {
      return {
        ok: false,
        message: parseAuthFailure(json, "Không làm mới được phiên đăng nhập."),
      };
    }
    const persisted = persistAuthTokens(json.data);
    if (!persisted.ok) return persisted;
    return { ok: true };
  } catch {
    return { ok: false, message: "Không kết nối được tới máy chủ." };
  }
}

export function updateLocalUserProfile(
  email: string,
  payload: Partial<Pick<LocalUser, "name" | "password">>,
): { ok: true } | { ok: false; message: string } {
  const users = readUsers();
  const idx = users.findIndex(
    (u) => u.email.trim().toLowerCase() === email.trim().toLowerCase(),
  );
  if (idx === -1) {
    if (payload.name?.trim()) {
      updateCurrentSessionName(payload.name.trim());
    }
    return { ok: true };
  }

  const next = [...users];
  next[idx] = {
    ...next[idx],
    ...(payload.name ? { name: payload.name.trim() } : {}),
    ...(payload.password ? { password: payload.password } : {}),
  };
  writeUsers(next);

  if (payload.name?.trim()) {
    updateCurrentSessionName(payload.name.trim());
  }

  return { ok: true };
}
