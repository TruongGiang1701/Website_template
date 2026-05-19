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
exports.OrdersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const http_error_1 = require("../../common/http-error");
const jwt_auth_guard_1 = require("../../modules/auth/jwt-auth.guard");
const users_types_1 = require("../../modules/users/users.types");
const orders_errors_1 = require("./orders.errors");
const orders_service_1 = require("./orders.service");
function toOrdersError(error) {
    if (error instanceof common_1.HttpException)
        throw error;
    if (error instanceof orders_errors_1.OrdersMutationError) {
        throw (0, http_error_1.apiError)(error.message, error.statusCode);
    }
    const message = error instanceof Error ? error.message : "Unknown error";
    throw (0, http_error_1.apiError)(message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
}
let OrdersController = class OrdersController {
    orders;
    constructor(orders) {
        this.orders = orders;
    }
    async create(user, body) {
        try {
            const payload = (0, http_error_1.asPlainObject)(body);
            const data = await this.orders.create(user.sub, {
                contact_name: typeof payload.contact_name === "string"
                    ? payload.contact_name
                    : typeof payload.contactName === "string"
                        ? payload.contactName
                        : undefined,
                contact_email: typeof payload.contact_email === "string"
                    ? payload.contact_email
                    : typeof payload.contactEmail === "string"
                        ? payload.contactEmail
                        : undefined,
                note: typeof payload.note === "string" ? payload.note : undefined,
            });
            return { ok: true, data };
        }
        catch (error) {
            return toOrdersError(error);
        }
    }
    async list(user) {
        try {
            const data = await this.orders.list(user.sub);
            return { ok: true, data };
        }
        catch (error) {
            return toOrdersError(error);
        }
    }
    async detail(user, code) {
        try {
            const decoded = decodeURIComponent(code ?? "").trim();
            if (!decoded)
                throw (0, http_error_1.apiError)("Thiếu mã đơn hàng.", common_1.HttpStatus.BAD_REQUEST);
            const data = await this.orders.detailByCode(user.sub, decoded);
            return { ok: true, data };
        }
        catch (error) {
            return toOrdersError(error);
        }
    }
};
exports.OrdersController = OrdersController;
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: "Checkout - tạo đơn hàng từ giỏ hiện tại",
        description: "Lấy toàn bộ `cart_items` từ giỏ hiện tại của user, tính subtotal/total, tạo `orders` + `order_items` + `order_events`, sau đó clear giỏ.",
    }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: "object",
            properties: {
                contact_name: { type: "string", example: "Nguyen Van A" },
                contact_email: {
                    type: "string",
                    format: "email",
                    example: "a@example.com",
                },
                note: {
                    type: "string",
                    example: "Cần triển khai trong 2 tuần, ưu tiên mobile first.",
                },
            },
        },
    }),
    (0, swagger_1.ApiOkResponse)({
        description: "Tạo đơn thành công. Response trả chi tiết đơn gồm items snapshot và events.",
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: "Giỏ trống hoặc payload sai định dạng.",
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: "Thiếu hoặc sai access token." }),
    (0, common_1.Post)(),
    __param(0, (0, users_types_1.AuthUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: "Lịch sử đơn hàng của user hiện tại",
        description: "Trả danh sách đơn theo `created_at DESC`.",
    }),
    (0, swagger_1.ApiOkResponse)({
        description: "Danh sách đơn hàng.",
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: "Thiếu hoặc sai access token." }),
    (0, common_1.Get)(),
    __param(0, (0, users_types_1.AuthUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "list", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: "Chi tiết đơn hàng theo mã code",
        description: "Chỉ truy cập được đơn hàng của chính user đang đăng nhập.",
    }),
    (0, swagger_1.ApiParam)({ name: "code", example: "ORD-20260512-181015-AB12C" }),
    (0, swagger_1.ApiOkResponse)({ description: "Chi tiết đơn hàng + items + events." }),
    (0, swagger_1.ApiNotFoundResponse)({ description: "Không tìm thấy đơn hàng." }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: "Thiếu hoặc sai access token." }),
    (0, common_1.Get)(":code"),
    __param(0, (0, users_types_1.AuthUser)()),
    __param(1, (0, common_1.Param)("code")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "detail", null);
exports.OrdersController = OrdersController = __decorate([
    (0, swagger_1.ApiTags)("Orders"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)("orders"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Inject)(orders_service_1.OrdersService)),
    __metadata("design:paramtypes", [orders_service_1.OrdersService])
], OrdersController);
