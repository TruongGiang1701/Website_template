import { existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";

/** Thư mục `backend/` (chứa `public/`), ổn định khi cwd không phải `backend/`. */
const backendRoot = join(__dirname, "..", "..");

export const UPLOADS_DIR = join(backendRoot, "public", "uploads");

export function ensureUploadsDir() {
  if (!existsSync(UPLOADS_DIR)) {
    mkdirSync(UPLOADS_DIR, { recursive: true });
  }
}

/** URL path phục vụ qua ServeStatic (`/public` → thư mục `backend/public`). */
export function publicUploadUrl(filename: string): string {
  return `/public/uploads/${filename}`;
}
