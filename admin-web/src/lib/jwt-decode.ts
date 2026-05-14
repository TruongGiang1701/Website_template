/** Payload JWT (không xác minh chữ ký — chỉ dùng cho UX routing; API vẫn xác thực token). */
export type JwtAccessPayload = {
  sub?: string;
  email?: string;
  role?: string;
  token_use?: string;
  exp?: number;
};

export function decodeJwtPayload(token: string): JwtAccessPayload | null {
  try {
    const part = token.split(".")[1];
    if (!part) return null;
    const base64 = part.replace(/-/g, "+").replace(/_/g, "/");
    const pad = base64.length % 4 === 0 ? "" : "=".repeat(4 - (base64.length % 4));
    const json = atob(base64 + pad);
    return JSON.parse(json) as JwtAccessPayload;
  } catch {
    return null;
  }
}

export function getAccessTokenMaxAgeSeconds(token: string): number {
  const payload = decodeJwtPayload(token);
  if (!payload?.exp || typeof payload.exp !== "number") return 60 * 60 * 8;
  const sec = payload.exp - Math.floor(Date.now() / 1000);
  return Math.min(Math.max(sec, 60), 60 * 60 * 24 * 30);
}

export function isValidAccessTokenShape(token: string): boolean {
  const d = decodeJwtPayload(token);
  if (!d) return false;
  if (d.token_use === "refresh") return false;
  if (typeof d.exp === "number" && d.exp < Math.floor(Date.now() / 1000)) return false;
  return true;
}
