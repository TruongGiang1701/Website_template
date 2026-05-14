import { randomUUID } from "node:crypto";

export const GUEST_CART_COOKIE = "visstemp_guest_cart_sid";
export const GUEST_CART_COOKIE_MAX_AGE = 60 * 60 * 24 * 90;

type CookieBag = Record<string, string | undefined>;
type CookieWritableResponse = {
  cookie: (
    name: string,
    value: string,
    options: {
      httpOnly: boolean;
      sameSite: "lax";
      path: string;
      maxAge: number;
      secure: boolean;
    },
  ) => unknown;
};

export function readGuestCartSessionId(cookies: CookieBag): string | undefined {
  const v = cookies[GUEST_CART_COOKIE]?.trim();
  return v && v.length > 0 ? v : undefined;
}

export function getOrCreateGuestSessionId(cookies: CookieBag): {
  sessionId: string;
  isNew: boolean;
} {
  const existing = readGuestCartSessionId(cookies);
  if (existing) return { sessionId: existing, isNew: false };
  return { sessionId: randomUUID(), isNew: true };
}

export function setGuestCartSessionCookie(
  res: CookieWritableResponse,
  sessionId: string,
  secure: boolean,
) {
  res.cookie(GUEST_CART_COOKIE, sessionId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: GUEST_CART_COOKIE_MAX_AGE * 1000,
    secure,
  });
}
