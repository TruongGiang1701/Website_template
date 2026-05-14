export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value || value.trim().length === 0) {
    throw new Error(`Missing ${name} in environment variables.`);
  }
  return value;
}

export function getDatabaseUrl(): string {
  const value = process.env.DATABASE_URL?.trim();
  if (value) return value;
  throw new Error(
    "Missing DATABASE_URL. Tạo file backend/.env từ backend/.env.example và gán chuỗi kết nối PostgreSQL, hoặc đặt biến môi trường DATABASE_URL rồi khởi động lại server.",
  );
}

export function getJwtSecret(): string {
  const v = process.env.JWT_SECRET?.trim();
  return v && v.length > 0 ? v : "dev_jwt_secret_change_me";
}

export function getJwtAccessExpiresIn(): string {
  const v = process.env.JWT_ACCESS_EXPIRES_IN?.trim();
  return v && v.length > 0 ? v : "15m";
}

export function getJwtRefreshExpiresIn(): string {
  const v = process.env.JWT_REFRESH_EXPIRES_IN?.trim();
  return v && v.length > 0 ? v : "30d";
}
