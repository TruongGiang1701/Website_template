"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireEnv = requireEnv;
exports.getDatabaseUrl = getDatabaseUrl;
exports.getJwtSecret = getJwtSecret;
exports.getJwtAccessExpiresIn = getJwtAccessExpiresIn;
exports.getJwtRefreshExpiresIn = getJwtRefreshExpiresIn;
function requireEnv(name) {
    const value = process.env[name];
    if (!value || value.trim().length === 0) {
        throw new Error(`Missing ${name} in environment variables.`);
    }
    return value;
}
function getDatabaseUrl() {
    const value = process.env.DATABASE_URL?.trim();
    if (value)
        return value;
    throw new Error("Missing DATABASE_URL. Tạo file backend/.env từ backend/.env.example và gán chuỗi kết nối PostgreSQL, hoặc đặt biến môi trường DATABASE_URL rồi khởi động lại server.");
}
function getJwtSecret() {
    const v = process.env.JWT_SECRET?.trim();
    return v && v.length > 0 ? v : "dev_jwt_secret_change_me";
}
function getJwtAccessExpiresIn() {
    const v = process.env.JWT_ACCESS_EXPIRES_IN?.trim();
    return v && v.length > 0 ? v : "15m";
}
function getJwtRefreshExpiresIn() {
    const v = process.env.JWT_REFRESH_EXPIRES_IN?.trim();
    return v && v.length > 0 ? v : "30d";
}
