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
exports.CartController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const http_error_1 = require("../../common/http-error");
const guest_session_cookie_1 = require("../../lib/cart/guest-session-cookie");
const jwt_auth_guard_1 = require("../../modules/auth/jwt-auth.guard");
const optional_jwt_auth_guard_1 = require("../../modules/auth/optional-jwt-auth.guard");
const users_types_1 = require("../../modules/users/users.types");
const cart_errors_1 = require("./cart.errors");
const cart_service_1 = require("./cart.service");
function cookieSecure() {
    return process.env.NODE_ENV === "production";
}
function parseQty(raw) {
    if (typeof raw === "number" && Number.isFinite(raw))
        return raw;
    if (typeof raw === "string" && raw.trim().length > 0) {
        const n = Number.parseInt(raw, 10);
        return Number.isFinite(n) ? n : null;
    }
    return null;
}
function toCartError(error) {
    if (error instanceof common_1.HttpException)
        throw error;
    if (error instanceof cart_errors_1.CartMutationError) {
        throw (0, http_error_1.apiError)(error.message, error.statusCode);
    }
    const message = error instanceof Error ? error.message : "Unknown error";
    const status = message.includes("JSON") || message.includes("Body")
        ? common_1.HttpStatus.BAD_REQUEST
        : common_1.HttpStatus.INTERNAL_SERVER_ERROR;
    throw (0, http_error_1.apiError)(message, status);
}
let CartController = class CartController {
    cart;
    constructor(cart) {
        this.cart = cart;
    }
    async getCart(req, res) {
        try {
            const user = req.user;
            if (user?.sub) {
                const data = await this.cart.getUser(user.sub);
                return { ok: true, data };
            }
            const { sessionId, isNew } = (0, guest_session_cookie_1.getOrCreateGuestSessionId)(req.cookies ?? {});
            const data = await this.cart.getGuest(sessionId);
            if (isNew)
                (0, guest_session_cookie_1.setGuestCartSessionCookie)(res, sessionId, cookieSecure());
            return { ok: true, data };
        }
        catch (error) {
            return toCartError(error);
        }
    }
    async mergeCart(req, res, user) {
        try {
            const { sessionId, isNew } = (0, guest_session_cookie_1.getOrCreateGuestSessionId)(req.cookies ?? {});
            const data = await this.cart.mergeGuestIntoUser(sessionId, user.sub);
            if (isNew)
                (0, guest_session_cookie_1.setGuestCartSessionCookie)(res, sessionId, cookieSecure());
            return { ok: true, data };
        }
        catch (error) {
            return toCartError(error);
        }
    }
    async upsertItem(req, res, body) {
        try {
            const user = req.user;
            const { sessionId, isNew } = (0, guest_session_cookie_1.getOrCreateGuestSessionId)(req.cookies ?? {});
            const json = (0, http_error_1.asPlainObject)(body);
            const productId = typeof json.productId === "string" ? json.productId.trim() : "";
            const qty = parseQty(json.qty);
            if (!productId) {
                throw (0, http_error_1.apiError)("Thiếu productId (uuid, legacy_key hoặc slug)", common_1.HttpStatus.BAD_REQUEST);
            }
            if (qty === null || qty < 1) {
                throw (0, http_error_1.apiError)("qty phải là số nguyên ≥ 1", common_1.HttpStatus.BAD_REQUEST);
            }
            if (user?.sub) {
                await this.cart.upsertUserItem(user.sub, productId, qty);
                const data = await this.cart.getUser(user.sub);
                return { ok: true, data };
            }
            await this.cart.upsertGuestItem(sessionId, productId, qty);
            const data = await this.cart.getGuest(sessionId);
            if (isNew)
                (0, guest_session_cookie_1.setGuestCartSessionCookie)(res, sessionId, cookieSecure());
            return { ok: true, data };
        }
        catch (error) {
            return toCartError(error);
        }
    }
    async removeItem(req, res, productIdRaw) {
        try {
            const productId = productIdRaw?.trim() ?? "";
            if (!productId) {
                throw (0, http_error_1.apiError)("Thiếu query productId", common_1.HttpStatus.BAD_REQUEST);
            }
            const user = req.user;
            const { sessionId, isNew } = (0, guest_session_cookie_1.getOrCreateGuestSessionId)(req.cookies ?? {});
            if (user?.sub) {
                await this.cart.removeUserItem(user.sub, productId);
                const data = await this.cart.getUser(user.sub);
                return { ok: true, data };
            }
            await this.cart.removeGuestItem(sessionId, productId);
            const data = await this.cart.getGuest(sessionId);
            if (isNew)
                (0, guest_session_cookie_1.setGuestCartSessionCookie)(res, sessionId, cookieSecure());
            return { ok: true, data };
        }
        catch (error) {
            return toCartError(error);
        }
    }
};
exports.CartController = CartController;
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: "Lấy giỏ hàng hiện tại (user nếu đã login, guest nếu chưa)",
        description: "Nếu có Bearer access token hợp lệ → trả giỏ theo user. Nếu chưa login → dùng cookie guest (`visstemp_guest_cart_sid`). Nếu chưa có cookie sẽ tự tạo và trả giỏ rỗng.",
    }),
    (0, swagger_1.ApiOkResponse)({
        description: "Trả về snapshot giỏ hàng hiện tại.",
    }),
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(optional_jwt_auth_guard_1.OptionalJwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "getCart", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: "Gộp giỏ guest vào user sau login",
        description: "Yêu cầu Bearer access token + cookie guest hiện tại. Swagger không tự giữ cookie của trình duyệt nếu mở tab mới, nên để test merge thật nên gọi từ cùng session hoặc Postman.",
    }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: "Thiếu hoặc sai access token." }),
    (0, swagger_1.ApiOkResponse)({
        description: "Gộp thành công, trả về giỏ sau gộp của user.",
    }),
    (0, common_1.Post)("merge"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __param(2, (0, users_types_1.AuthUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "mergeCart", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: "Thêm/cập nhật số lượng sản phẩm trong giỏ",
        description: "Nếu có Bearer access token hợp lệ → cập nhật giỏ theo user. Nếu chưa login → cập nhật giỏ guest theo cookie. `productId` chấp nhận uuid, `legacy_key` (vd `tpl-01`) hoặc `slug`.",
    }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: "object",
            required: ["productId", "qty"],
            properties: {
                productId: { type: "string", example: "tpl-01" },
                qty: { type: "number", example: 2, minimum: 1 },
            },
        },
    }),
    (0, swagger_1.ApiOkResponse)({
        description: "Cập nhật thành công và trả giỏ mới nhất.",
    }),
    (0, common_1.Post)("items"),
    (0, common_1.UseGuards)(optional_jwt_auth_guard_1.OptionalJwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "upsertItem", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: "Xóa một sản phẩm khỏi giỏ",
    }),
    (0, swagger_1.ApiQuery)({
        name: "productId",
        required: true,
        description: "uuid, legacy_key hoặc slug của sản phẩm cần xóa.",
        example: "tpl-01",
    }),
    (0, swagger_1.ApiOkResponse)({
        description: "Xóa xong và trả snapshot giỏ mới.",
    }),
    (0, common_1.Delete)("items"),
    (0, common_1.UseGuards)(optional_jwt_auth_guard_1.OptionalJwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __param(2, (0, common_1.Query)("productId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "removeItem", null);
exports.CartController = CartController = __decorate([
    (0, swagger_1.ApiTags)("Cart"),
    (0, common_1.Controller)("cart"),
    __param(0, (0, common_1.Inject)(cart_service_1.CartService)),
    __metadata("design:paramtypes", [cart_service_1.CartService])
], CartController);
