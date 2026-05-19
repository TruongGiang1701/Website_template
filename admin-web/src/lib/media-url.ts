/**
 * URL ảnh từ upload backend (`/public/uploads/...`).
 * Admin-web proxy `/public/*` → backend; URL tuyệt đối giữ nguyên.
 */
export function resolveMediaUrl(url: string): string {
  const trimmed = url?.trim() ?? "";
  if (!trimmed) return "";
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("data:")) {
    return trimmed;
  }
  if (trimmed.startsWith("/")) return trimmed;
  return `/${trimmed}`;
}
