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
exports.AdminOrdersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const http_error_1 = require("../../common/http-error");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const roles_guard_1 = require("../../common/guards/roles.guard");
const jwt_auth_guard_1 = require("../../modules/auth/jwt-auth.guard");
const users_types_1 = require("../../modules/users/users.types");
const orders_errors_1 = require("../../modules/orders/orders.errors");
const admin_orders_service_1 = require("./admin-orders.service");
function toOrdersError(error) {
    if (error instanceof common_1.HttpException)
        throw error;
    if (error instanceof orders_errors_1.OrdersMutationError) {
        throw (0, http_error_1.apiError)(error.message, error.statusCode);
    }
    const message = error instanceof Error ? error.message : "Unknown error";
    throw (0, http_error_1.apiError)(message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
}
function parsePage(value, fallback) {
    const n = Number.parseInt(String(value ?? ""), 10);
    return Number.isFinite(n) && n > 0 ? n : fallback;
}
function parsePageSize(value) {
    const n = Number.parseInt(String(value ?? ""), 10);
    if (!Number.isFinite(n) || n < 1)
        return 20;
    return Math.min(100, n);
}
function parseOrderStatusBody(value) {
    const raw = typeof value === "string" ? value.trim() : "";
    if (raw === "pending" || raw === "processing" || raw === "completed" || raw === "cancelled") {
        return raw;
    }
    throw (0, http_error_1.apiError)("Thiếu status hoặc giá trị không hợp lệ.", common_1.HttpStatus.BAD_REQUEST);
}
let AdminOrdersController = class AdminOrdersController {
    adminOrders;
    constructor(adminOrders) {
        this.adminOrders = adminOrders;
    }
    async list(page, pageSize, status, payment_status, q) {
        try {
            const data = await this.adminOrders.list({
                page: parsePage(page, 1),
                pageSize: parsePageSize(pageSize),
                status: status?.trim() || null,
                payment_status: payment_status?.trim() || null,
                q: q?.trim() || null,
            });
            return { ok: true, data };
        }
        catch (error) {
            return toOrdersError(error);
        }
    }
    async detail(id) {
        try {
            const data = await this.adminOrders.detail(id.trim());
            return { ok: true, data };
        }
        catch (error) {
            return toOrdersError(error);
        }
    }
    async patchStatus(user, id, body) {
        try {
            const payload = (0, http_error_1.asPlainObject)(body);
            const status = parseOrderStatusBody(payload.status);
            const data = await this.adminOrders.patchStatus(id.trim(), user.sub, status);
            return { ok: true, data };
        }
        catch (error) {
            return toOrdersError(error);
        }
    }
};
exports.AdminOrdersController = AdminOrdersController;
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: "Danh sách đơn hàng (admin)",
        description: "Phân trang, lọc theo status / payment_status, tìm theo mã đơn, email liên hệ hoặc email tài khoản khách.",
    }),
    (0, swagger_1.ApiOkResponse)({ description: "Danh sách + meta phân trang." }),
    (0, swagger_1.ApiUnauthorizedResponse)(),
    (0, swagger_1.ApiForbiddenResponse)(),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)("page")),
    __param(1, (0, common_1.Query)("pageSize")),
    __param(2, (0, common_1.Query)("status")),
    __param(3, (0, common_1.Query)("payment_status")),
    __param(4, (0, common_1.Query)("q")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], AdminOrdersController.prototype, "list", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Chi tiết đơn hàng theo id (admin)" }),
    (0, swagger_1.ApiParam)({ name: "id", format: "uuid" }),
    (0, swagger_1.ApiOkResponse)({ description: "Chi tiết đơn + items + timeline order_events." }),
    (0, swagger_1.ApiUnauthorizedResponse)(),
    (0, swagger_1.ApiForbiddenResponse)(),
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminOrdersController.prototype, "detail", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: "Cập nhật trạng thái đơn hàng",
        description: "Ghi `order_events` với source=admin, event_type=order_status_updated.",
    }),
    (0, swagger_1.ApiParam)({ name: "id", format: "uuid" }),
    (0, swagger_1.ApiOkResponse)({ description: "Đơn sau khi cập nhật." }),
    (0, swagger_1.ApiUnauthorizedResponse)(),
    (0, swagger_1.ApiForbiddenResponse)(),
    (0, common_1.Patch)(":id/status"),
    __param(0, (0, users_types_1.AuthUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], AdminOrdersController.prototype, "patchStatus", null);
exports.AdminOrdersController = AdminOrdersController = __decorate([
    (0, swagger_1.ApiTags)("Admin — Orders"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)("admin/orders"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("admin", "staff"),
    __param(0, (0, common_1.Inject)(admin_orders_service_1.AdminOrdersService)),
    __metadata("design:paramtypes", [admin_orders_service_1.AdminOrdersService])
], AdminOrdersController);
