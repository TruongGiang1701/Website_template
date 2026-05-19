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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const http_error_1 = require("../../common/http-error");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const roles_guard_1 = require("../../common/guards/roles.guard");
const auth_service_1 = require("./auth.service");
const jwt_auth_guard_1 = require("./jwt-auth.guard");
const users_types_1 = require("../users/users.types");
const authSuccessSchema = {
    type: "object",
    properties: {
        ok: { type: "boolean", example: true },
        data: {
            type: "object",
            properties: {
                token: {
                    type: "string",
                    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyZjQ...kB0",
                },
                accessToken: {
                    type: "string",
                    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.access-token",
                },
                refreshToken: {
                    type: "string",
                    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.refresh-token",
                },
                tokenType: {
                    type: "string",
                    example: "Bearer",
                },
                accessExpiresIn: {
                    type: "string",
                    example: "15m",
                },
                refreshExpiresIn: {
                    type: "string",
                    example: "30d",
                },
                user: {
                    type: "object",
                    properties: {
                        id: { type: "string", format: "uuid" },
                        email: { type: "string", format: "email" },
                        name: { type: "string" },
                        role: { type: "string", enum: ["admin", "staff", "customer"] },
                        avatar_url: { type: "string", nullable: true },
                        is_disabled: { type: "boolean" },
                        settings: {
                            type: "object",
                            properties: {
                                display_name: { type: "string" },
                                preferred_category: { type: "string" },
                                notify_promotions: { type: "boolean" },
                                notify_order_updates: { type: "boolean" },
                                show_profile_public: { type: "boolean" },
                            },
                        },
                    },
                },
            },
        },
    },
};
const authErrorSchema = {
    type: "object",
    properties: {
        ok: { type: "boolean", example: false },
        error: { type: "string", example: "Thiếu name, email hoặc password." },
    },
};
let AuthController = class AuthController {
    auth;
    constructor(auth) {
        this.auth = auth;
    }
    async register(body) {
        try {
            const data = await this.auth.register((0, http_error_1.asPlainObject)(body));
            return { ok: true, data };
        }
        catch (error) {
            if (error instanceof common_1.HttpException)
                throw error;
            const message = error instanceof Error ? error.message : "Unknown error";
            throw (0, http_error_1.apiError)(message, 500);
        }
    }
    async login(body) {
        try {
            const data = await this.auth.login((0, http_error_1.asPlainObject)(body));
            return { ok: true, data };
        }
        catch (error) {
            if (error instanceof common_1.HttpException)
                throw error;
            const message = error instanceof Error ? error.message : "Unknown error";
            throw (0, http_error_1.apiError)(message, 500);
        }
    }
    async adminLogin(body) {
        try {
            const data = await this.auth.adminLogin((0, http_error_1.asPlainObject)(body));
            return { ok: true, data };
        }
        catch (error) {
            if (error instanceof common_1.HttpException)
                throw error;
            const message = error instanceof Error ? error.message : "Unknown error";
            throw (0, http_error_1.apiError)(message, 500);
        }
    }
    async refresh(body) {
        try {
            const data = await this.auth.refresh((0, http_error_1.asPlainObject)(body));
            return { ok: true, data };
        }
        catch (error) {
            if (error instanceof common_1.HttpException)
                throw error;
            const message = error instanceof Error ? error.message : "Unknown error";
            throw (0, http_error_1.apiError)(message, 500);
        }
    }
    async me(reqUser) {
        const data = await this.auth.me(reqUser.sub);
        return { ok: true, data };
    }
    async adminMe(reqUser) {
        const data = await this.auth.me(reqUser.sub);
        return { ok: true, data };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: "Đăng ký tài khoản",
        description: "Tạo user mới (role customer), hash password bằng bcrypt, tạo user_settings mặc định và trả access token + refresh token.",
    }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: "object",
            required: ["name", "email", "password"],
            properties: {
                name: { type: "string", example: "Nguyen Van A" },
                email: {
                    type: "string",
                    format: "email",
                    example: "nguyenvana@example.com",
                },
                password: { type: "string", example: "StrongPass123!" },
            },
        },
    }),
    (0, swagger_1.ApiCreatedResponse)({
        description: "Đăng ký thành công.",
        schema: authSuccessSchema,
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: "Thiếu field, email không đúng định dạng, hoặc password không hợp lệ.",
        schema: authErrorSchema,
    }),
    (0, swagger_1.ApiConflictResponse)({
        description: "Email đã tồn tại.",
        schema: {
            type: "object",
            properties: {
                ok: { type: "boolean", example: false },
                error: { type: "string", example: "Email đã tồn tại." },
            },
        },
    }),
    (0, swagger_1.ApiInternalServerErrorResponse)({
        description: "Lỗi hệ thống.",
        schema: {
            type: "object",
            properties: {
                ok: { type: "boolean", example: false },
                error: { type: "string", example: "Unknown error" },
            },
        },
    }),
    (0, common_1.Post)("register"),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: "Đăng nhập",
        description: "Xác thực email/password. Thành công trả access token + refresh token + thông tin user.",
    }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: "object",
            required: ["email", "password"],
            properties: {
                email: {
                    type: "string",
                    format: "email",
                    example: "nguyenvana@example.com",
                },
                password: { type: "string", example: "StrongPass123!" },
            },
        },
    }),
    (0, swagger_1.ApiOkResponse)({
        description: "Đăng nhập thành công.",
        schema: authSuccessSchema,
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: "Thiếu email/password hoặc email không đúng định dạng.",
        schema: {
            type: "object",
            properties: {
                ok: { type: "boolean", example: false },
                error: {
                    type: "string",
                    example: "Email không đúng định dạng.",
                },
            },
        },
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: "Sai thông tin đăng nhập.",
        schema: {
            type: "object",
            properties: {
                ok: { type: "boolean", example: false },
                error: { type: "string", example: "Sai email hoặc password." },
            },
        },
    }),
    (0, swagger_1.ApiForbiddenResponse)({
        description: "Tài khoản bị khóa.",
        schema: {
            type: "object",
            properties: {
                ok: { type: "boolean", example: false },
                error: { type: "string", example: "Tài khoản đã bị khóa." },
            },
        },
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: "Tài khoản hợp lệ nhưng không đọc được profile.",
        schema: {
            type: "object",
            properties: {
                ok: { type: "boolean", example: false },
                error: { type: "string", example: "Không tìm thấy hồ sơ người dùng." },
            },
        },
    }),
    (0, common_1.Post)("login"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, swagger_1.ApiTags)("Admin"),
    (0, swagger_1.ApiOperation)({
        summary: "Đăng nhập Admin (console quản trị)",
        description: "Xác thực email/password từ bảng `users`. Chỉ tài khoản có `role = 'admin'` mới nhận token; tài khoản khác nhận 401 (không phân biệt lý do).",
    }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: "object",
            required: ["email", "password"],
            properties: {
                email: {
                    type: "string",
                    format: "email",
                    example: "admin@example.com",
                },
                password: { type: "string", example: "StrongPass123!" },
            },
        },
    }),
    (0, swagger_1.ApiOkResponse)({
        description: "Đăng nhập admin thành công.",
        schema: authSuccessSchema,
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: "Thiếu email/password hoặc email không đúng định dạng.",
        schema: {
            type: "object",
            properties: {
                ok: { type: "boolean", example: false },
                error: { type: "string", example: "Email không đúng định dạng." },
            },
        },
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: "Sai email/password, hoặc tài khoản không phải admin.",
        schema: {
            type: "object",
            properties: {
                ok: { type: "boolean", example: false },
                error: { type: "string", example: "Sai email hoặc password." },
            },
        },
    }),
    (0, swagger_1.ApiForbiddenResponse)({
        description: "Tài khoản admin bị khóa.",
        schema: {
            type: "object",
            properties: {
                ok: { type: "boolean", example: false },
                error: { type: "string", example: "Tài khoản đã bị khóa." },
            },
        },
    }),
    (0, common_1.Post)("admin/login"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "adminLogin", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: "Làm mới access token",
        description: "Gửi `refreshToken` (JWT có `token_use: refresh`). Trả về cặp token mới + profile (rotation refresh).",
    }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: "object",
            required: ["refreshToken"],
            properties: {
                refreshToken: {
                    type: "string",
                    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                },
            },
        },
    }),
    (0, swagger_1.ApiOkResponse)({
        description: "Cấp token mới thành công.",
        schema: authSuccessSchema,
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: "Thiếu refreshToken.",
        schema: authErrorSchema,
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: "Refresh token sai / hết hạn / không phải refresh token.",
        schema: {
            type: "object",
            properties: {
                ok: { type: "boolean", example: false },
                error: {
                    type: "string",
                    example: "Refresh token không hợp lệ hoặc đã hết hạn.",
                },
            },
        },
    }),
    (0, swagger_1.ApiForbiddenResponse)({
        description: "Tài khoản bị khóa.",
        schema: {
            type: "object",
            properties: {
                ok: { type: "boolean", example: false },
                error: { type: "string", example: "Tài khoản đã bị khóa." },
            },
        },
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: "User không còn tồn tại.",
        schema: {
            type: "object",
            properties: {
                ok: { type: "boolean", example: false },
                error: { type: "string", example: "Không tìm thấy người dùng." },
            },
        },
    }),
    (0, common_1.Post)("refresh"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refresh", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: "Lấy thông tin tài khoản hiện tại",
        description: "Yêu cầu Bearer token hợp lệ. Trả về user + user_settings hiện tại.",
    }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOkResponse)({
        description: "Lấy thông tin thành công.",
        schema: {
            type: "object",
            properties: {
                ok: { type: "boolean", example: true },
                data: {
                    type: "object",
                    properties: {
                        id: { type: "string", format: "uuid" },
                        email: { type: "string", format: "email" },
                        name: { type: "string" },
                        role: { type: "string", enum: ["admin", "staff", "customer"] },
                        avatar_url: { type: "string", nullable: true },
                        is_disabled: { type: "boolean" },
                        settings: {
                            type: "object",
                            properties: {
                                display_name: { type: "string" },
                                preferred_category: { type: "string" },
                                notify_promotions: { type: "boolean" },
                                notify_order_updates: { type: "boolean" },
                                show_profile_public: { type: "boolean" },
                            },
                        },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: "Thiếu token / token sai / token hết hạn.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "number", example: 401 },
                message: { type: "string", example: "Unauthorized" },
            },
        },
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: "User id trong token không còn tồn tại.",
        schema: {
            type: "object",
            properties: {
                ok: { type: "boolean", example: false },
                error: { type: "string", example: "Không tìm thấy người dùng." },
            },
        },
    }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)("me"),
    __param(0, (0, users_types_1.AuthUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "me", null);
__decorate([
    (0, swagger_1.ApiTags)("Admin"),
    (0, swagger_1.ApiOperation)({
        summary: "Lấy hồ sơ admin hiện tại (từ DB)",
        description: "Bearer access token. Yêu cầu `role = admin` trong JWT; dùng để admin-web xác minh phiên sau khi đăng nhập.",
    }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOkResponse)({
        description: "Thành công.",
        schema: {
            type: "object",
            properties: {
                ok: { type: "boolean", example: true },
                data: {
                    type: "object",
                    properties: {
                        id: { type: "string", format: "uuid" },
                        email: { type: "string", format: "email" },
                        name: { type: "string" },
                        role: { type: "string", example: "admin" },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: "Thiếu token / token sai / token hết hạn.",
    }),
    (0, swagger_1.ApiForbiddenResponse)({ description: "Token hợp lệ nhưng không phải admin." }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("admin"),
    (0, common_1.Get)("admin/me"),
    __param(0, (0, users_types_1.AuthUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "adminMe", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)("Auth"),
    (0, common_1.Controller)("auth"),
    __param(0, (0, common_1.Inject)(auth_service_1.AuthService)),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
