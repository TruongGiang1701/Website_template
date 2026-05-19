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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const http_error_1 = require("../../common/http-error");
const users_errors_1 = require("./users.errors");
const jwt_auth_guard_1 = require("../../modules/auth/jwt-auth.guard");
const users_types_1 = require("./users.types");
const users_service_1 = require("./users.service");
let UsersController = class UsersController {
    users;
    constructor(users) {
        this.users = users;
    }
    async updateSettings(reqUser, body) {
        try {
            const data = await this.users.updateSettings(reqUser.sub, (0, http_error_1.asPlainObject)(body));
            return { ok: true, data };
        }
        catch (error) {
            if (error instanceof common_1.HttpException)
                throw error;
            if (error instanceof users_errors_1.UsersMutationError) {
                throw (0, http_error_1.apiError)(error.message, error.statusCode);
            }
            const message = error instanceof Error ? error.message : "Unknown error";
            throw (0, http_error_1.apiError)(message, 500);
        }
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: "Cập nhật cài đặt cá nhân",
        description: "Yêu cầu Bearer token. Chỉ cần gửi field cần đổi; field không gửi sẽ giữ nguyên.",
    }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiBody)({
        schema: {
            type: "object",
            properties: {
                display_name: { type: "string", example: "Nguyen Van A" },
                preferred_category: { type: "string", example: "Doanh nghiệp" },
                notify_promotions: { type: "boolean", example: true },
                notify_order_updates: { type: "boolean", example: true },
                show_profile_public: { type: "boolean", example: false },
            },
            example: {
                display_name: "Nguyen Van A",
                preferred_category: "Doanh nghiệp",
                notify_promotions: false,
            },
        },
    }),
    (0, swagger_1.ApiOkResponse)({
        description: "Cập nhật thành công.",
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
    (0, swagger_1.ApiBadRequestResponse)({
        description: "Body sai format (không phải object JSON).",
        schema: {
            type: "object",
            properties: {
                ok: { type: "boolean", example: false },
                error: { type: "string", example: "Payload phải là object JSON" },
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
        description: "Không tìm thấy user hiện tại.",
        schema: {
            type: "object",
            properties: {
                ok: { type: "boolean", example: false },
                error: { type: "string", example: "Không tìm thấy người dùng." },
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
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)("settings"),
    __param(0, (0, users_types_1.AuthUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateSettings", null);
exports.UsersController = UsersController = __decorate([
    (0, swagger_1.ApiTags)("Users"),
    (0, common_1.Controller)("users"),
    __param(0, (0, common_1.Inject)(users_service_1.UsersService)),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
