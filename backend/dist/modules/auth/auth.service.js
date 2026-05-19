"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcryptjs_1 = require("bcryptjs");
const class_validator_1 = require("class-validator");
const http_error_1 = require("../../common/http-error");
const env_1 = require("../../lib/env");
const users_errors_1 = require("../../modules/users/users.errors");
const users_repository_1 = require("../../modules/users/users.repository");
const users_service_1 = require("../../modules/users/users.service");
let AuthService = class AuthService {
    jwt;
    users;
    constructor(jwt, users) {
        this.jwt = jwt;
        this.users = users;
    }
    signAccess(claims) {
        const payload = { ...claims, token_use: "access" };
        return this.jwt.sign(payload, {
            expiresIn: (0, env_1.getJwtAccessExpiresIn)(),
        });
    }
    signRefresh(claims) {
        const payload = { ...claims, token_use: "refresh" };
        return this.jwt.sign(payload, {
            expiresIn: (0, env_1.getJwtRefreshExpiresIn)(),
        });
    }
    buildAuthPayload(claims) {
        const accessToken = this.signAccess(claims);
        const refreshToken = this.signRefresh(claims);
        return {
            accessToken,
            refreshToken,
            // Backward compatible field for old clients still reading `token`.
            token: accessToken,
            tokenType: "Bearer",
            accessExpiresIn: (0, env_1.getJwtAccessExpiresIn)(),
            refreshExpiresIn: (0, env_1.getJwtRefreshExpiresIn)(),
        };
    }
    async register(raw) {
        const name = typeof raw.name === "string" ? raw.name.trim() : "";
        const email = typeof raw.email === "string" ? raw.email.trim().toLowerCase() : "";
        const password = typeof raw.password === "string" ? raw.password : "";
        if (!name || !email || !password) {
            throw (0, http_error_1.apiError)("Thiếu name, email hoặc password.", 400);
        }
        if (!(0, class_validator_1.isEmail)(email)) {
            throw (0, http_error_1.apiError)("Email không đúng định dạng.", 400);
        }
        if (password.length < 8) {
            throw (0, http_error_1.apiError)("Password tối thiểu 8 ký tự.", 400);
        }
        let user;
        try {
            const password_hash = await (0, bcryptjs_1.hash)(password, 12);
            user = await (0, users_repository_1.createUserWithSettings)({ name, email, password_hash });
        }
        catch (error) {
            if (error instanceof users_errors_1.UsersMutationError) {
                throw (0, http_error_1.apiError)(error.message, error.statusCode);
            }
            throw error;
        }
        const tokens = this.buildAuthPayload({
            sub: user.id,
            email: user.email,
            role: user.role,
        });
        return { ...tokens, user };
    }
    async login(raw) {
        const email = typeof raw.email === "string" ? raw.email.trim().toLowerCase() : "";
        const password = typeof raw.password === "string" ? raw.password : "";
        if (!email || !password) {
            throw (0, http_error_1.apiError)("Thiếu email hoặc password.", 400);
        }
        if (!(0, class_validator_1.isEmail)(email)) {
            throw (0, http_error_1.apiError)("Email không đúng định dạng.", 400);
        }
        const auth = await (0, users_repository_1.getUserAuthByEmail)(email);
        if (!auth)
            throw (0, http_error_1.apiError)("Sai email hoặc password.", 401);
        if (auth.is_disabled)
            throw (0, http_error_1.apiError)("Tài khoản đã bị khóa.", 403);
        const ok = await (0, bcryptjs_1.compare)(password, auth.password_hash);
        if (!ok)
            throw (0, http_error_1.apiError)("Sai email hoặc password.", 401);
        const user = await this.users.getProfile(auth.id);
        if (!user)
            throw (0, http_error_1.apiError)("Không tìm thấy hồ sơ người dùng.", 404);
        const tokens = this.buildAuthPayload({
            sub: user.id,
            email: user.email,
            role: user.role,
        });
        return { ...tokens, user };
    }
    /**
     * Đăng nhập console admin: cùng luồng DB như `login`, nhưng chỉ chấp nhận `users.role = 'admin'`.
     * Khách / staff / customer dù đúng mật khẩu vẫn bị từ chối (403) để không lộ endpoint chung.
     */
    async adminLogin(raw) {
        const email = typeof raw.email === "string" ? raw.email.trim().toLowerCase() : "";
        const password = typeof raw.password === "string" ? raw.password : "";
        if (!email || !password) {
            throw (0, http_error_1.apiError)("Thiếu email hoặc password.", 400);
        }
        if (!(0, class_validator_1.isEmail)(email)) {
            throw (0, http_error_1.apiError)("Email không đúng định dạng.", 400);
        }
        const auth = await (0, users_repository_1.getUserAuthByEmail)(email);
        if (!auth)
            throw (0, http_error_1.apiError)("Sai email hoặc password.", 401);
        if (auth.role !== "admin") {
            throw (0, http_error_1.apiError)("Sai email hoặc password.", 401);
        }
        if (auth.is_disabled)
            throw (0, http_error_1.apiError)("Tài khoản đã bị khóa.", 403);
        const ok = await (0, bcryptjs_1.compare)(password, auth.password_hash);
        if (!ok)
            throw (0, http_error_1.apiError)("Sai email hoặc password.", 401);
        const user = await this.users.getProfile(auth.id);
        if (!user)
            throw (0, http_error_1.apiError)("Không tìm thấy hồ sơ người dùng.", 404);
        if (user.role !== "admin") {
            throw (0, http_error_1.apiError)("Chỉ tài khoản admin mới được vào trang quản trị.", 403);
        }
        const tokens = this.buildAuthPayload({
            sub: user.id,
            email: user.email,
            role: user.role,
        });
        return { ...tokens, user };
    }
    async me(userId) {
        const user = await this.users.getProfile(userId);
        if (!user)
            throw (0, http_error_1.apiError)("Không tìm thấy người dùng.", 404);
        return user;
    }
    /**
     * Đổi refresh token → cặp access + refresh mới (rotation).
     * Chỉ chấp nhận JWT có `token_use: "refresh"` (token cũ không có claim này cần đăng nhập lại).
     */
    async refresh(raw) {
        const refreshToken = typeof raw.refreshToken === "string" ? raw.refreshToken.trim() : "";
        if (!refreshToken) {
            throw (0, http_error_1.apiError)("Thiếu refreshToken.", 400);
        }
        let decoded;
        try {
            decoded = this.jwt.verify(refreshToken);
        }
        catch {
            throw (0, http_error_1.apiError)("Refresh token không hợp lệ hoặc đã hết hạn.", 401);
        }
        if (decoded.token_use !== "refresh") {
            throw (0, http_error_1.apiError)("Không phải refresh token hợp lệ.", 401);
        }
        const user = await this.users.getProfile(decoded.sub);
        if (!user)
            throw (0, http_error_1.apiError)("Không tìm thấy người dùng.", 404);
        if (user.is_disabled)
            throw (0, http_error_1.apiError)("Tài khoản đã bị khóa.", 403);
        if (user.email.trim().toLowerCase() !== decoded.email.trim().toLowerCase()) {
            throw (0, http_error_1.apiError)("Refresh token không khớp tài khoản.", 401);
        }
        const tokens = this.buildAuthPayload({
            sub: user.id,
            email: user.email,
            role: user.role,
        });
        return { ...tokens, user };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(jwt_1.JwtService)),
    __param(1, (0, common_1.Inject)(users_service_1.UsersService)),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        users_service_1.UsersService])
], AuthService);
