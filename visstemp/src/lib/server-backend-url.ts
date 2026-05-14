/**
 * URL gốc của API Express (chạy riêng trong `backend/`).
 * Dùng cho Server Components / Route Handler khi `fetch` trực tiếp (không qua rewrite Next).
 */
export function getBackendUrlForServer(): string {
  const u = process.env.BACKEND_URL?.trim() || process.env.API_URL?.trim();
  if (u) return u.replace(/\/$/, "");
  return "http://127.0.0.1:4000";
}
