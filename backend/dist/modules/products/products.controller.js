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
exports.ProductsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const http_error_1 = require("../../common/http-error");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const roles_guard_1 = require("../../common/guards/roles.guard");
const jwt_auth_guard_1 = require("../../modules/auth/jwt-auth.guard");
const products_mutations_1 = require("./products.mutations");
const products_service_1 = require("./products.service");
const DEFAULT_LIMIT = 24;
const MAX_LIMIT = 50;
function truthyParam(value) {
    const v = value?.toLowerCase()?.trim();
    return v === "true" || v === "1" || v === "yes";
}
function parseCsv(raw) {
    return raw
        ? raw
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : undefined;
}
function parsePage(raw) {
    const n = raw ? Number.parseInt(raw, 10) : 1;
    return Number.isFinite(n) && n >= 1 ? n : 1;
}
function parseLimit(raw) {
    const n = raw ? Number.parseInt(raw, 10) : DEFAULT_LIMIT;
    const safe = Number.isFinite(n) && n >= 1 ? n : DEFAULT_LIMIT;
    return Math.min(safe, MAX_LIMIT);
}
function parsePriceBucket(raw) {
    if (raw === "under_10m" || raw === "10m_15m" || raw === "promo")
        return raw;
    return undefined;
}
function parseFeatured(raw) {
    if (raw === "true")
        return true;
    if (raw === "false")
        return false;
    return undefined;
}
function toProductError(error) {
    if (error instanceof common_1.HttpException)
        throw error;
    if (error instanceof products_mutations_1.ProductMutationError) {
        throw (0, http_error_1.apiError)(error.message, error.statusCode);
    }
    const message = error instanceof Error ? error.message : "Unknown error";
    const status = message.includes("JSON")
        ? common_1.HttpStatus.BAD_REQUEST
        : common_1.HttpStatus.INTERNAL_SERVER_ERROR;
    throw (0, http_error_1.apiError)(message, status);
}
let ProductsController = class ProductsController {
    products;
    constructor(products) {
        this.products = products;
    }
    async meta() {
        try {
            const data = await this.products.meta();
            return { ok: true, data };
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "Unknown error";
            throw (0, http_error_1.apiError)(message);
        }
    }
    async list(query) {
        try {
            const groups = parseCsv(query.groups);
            const legacyKeys = parseCsv(query.ids);
            const price_bucket = parsePriceBucket(query.price);
            const featured = parseFeatured(query.featured);
            const all_status = truthyParam(query.all_status);
            const include_deleted = truthyParam(query.include_deleted);
            const page = parsePage(query.page);
            const limit = parseLimit(query.limit);
            const offset = (page - 1) * limit;
            const filters = {
                q: query.q,
                group: query.group,
                groups,
                ...(legacyKeys && legacyKeys.length > 0
                    ? { legacy_keys: legacyKeys }
                    : {}),
                price_bucket,
                featured,
                all_status,
                include_deleted,
            };
            const [total, items] = await Promise.all([
                this.products.count(filters),
                this.products.list(filters, limit, offset),
            ]);
            const pageCount = Math.max(1, Math.ceil(total / limit));
            return {
                ok: true,
                data: items,
                meta: {
                    page,
                    limit,
                    total,
                    pageCount,
                    filters: {
                        ...(query.q?.trim() ? { q: query.q.trim() } : {}),
                        ...(query.group?.trim() ? { group: query.group.trim() } : {}),
                        ...(groups && groups.length > 0 ? { groups } : {}),
                        ...(legacyKeys && legacyKeys.length > 0 ? { ids: legacyKeys } : {}),
                        ...(price_bucket ? { price: price_bucket } : {}),
                        ...(featured !== undefined ? { featured } : {}),
                        ...(all_status ? { all_status: true } : {}),
                        ...(include_deleted ? { include_deleted: true } : {}),
                    },
                },
            };
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "Unknown error";
            throw (0, http_error_1.apiError)(message);
        }
    }
    async create(body) {
        try {
            const data = await this.products.create((0, http_error_1.asPlainObject)(body));
            return { ok: true, data };
        }
        catch (error) {
            return toProductError(error);
        }
    }
    async related(slug, limitRaw) {
        try {
            const decoded = decodeURIComponent(slug ?? "").trim();
            if (!decoded)
                throw (0, http_error_1.apiError)("Missing slug", common_1.HttpStatus.BAD_REQUEST);
            const detail = await this.products.detail(decoded);
            if (!detail)
                throw (0, http_error_1.apiError)("Not found", common_1.HttpStatus.NOT_FOUND);
            let limit = limitRaw ? Number.parseInt(limitRaw, 10) : 12;
            if (!Number.isFinite(limit) || limit < 1)
                limit = 12;
            limit = Math.min(50, limit);
            const data = await this.products.related(detail.slug, detail.group, limit);
            return { ok: true, data };
        }
        catch (error) {
            if (error instanceof products_mutations_1.ProductMutationError)
                return toProductError(error);
            throw error;
        }
    }
    async detail(slug) {
        try {
            const decoded = decodeURIComponent(slug ?? "").trim();
            if (!decoded)
                throw (0, http_error_1.apiError)("Missing slug", common_1.HttpStatus.BAD_REQUEST);
            const data = await this.products.detail(decoded);
            if (!data)
                throw (0, http_error_1.apiError)("Not found", common_1.HttpStatus.NOT_FOUND);
            return { ok: true, data };
        }
        catch (error) {
            if (error instanceof products_mutations_1.ProductMutationError)
                return toProductError(error);
            throw error;
        }
    }
    async update(slug, body) {
        try {
            const decoded = decodeURIComponent(slug ?? "").trim();
            if (!decoded)
                throw (0, http_error_1.apiError)("Missing slug", common_1.HttpStatus.BAD_REQUEST);
            const data = await this.products.update(decoded, (0, http_error_1.asPlainObject)(body));
            return { ok: true, data };
        }
        catch (error) {
            return toProductError(error);
        }
    }
    async remove(slug) {
        try {
            const decoded = decodeURIComponent(slug ?? "").trim();
            if (!decoded)
                throw (0, http_error_1.apiError)("Missing slug", common_1.HttpStatus.BAD_REQUEST);
            const data = await this.products.softDelete(decoded);
            return { ok: true, data };
        }
        catch (error) {
            return toProductError(error);
        }
    }
};
exports.ProductsController = ProductsController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Thống kê catalog cho UI filter/sidebar" }),
    (0, swagger_1.ApiOkResponse)({
        description: "Trả tổng số mẫu, số theo nhóm và theo loại website/landing.",
    }),
    (0, common_1.Get)("meta"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "meta", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: "Danh sách sản phẩm public có phân trang và filter",
    }),
    (0, swagger_1.ApiQuery)({ name: "q", required: false, description: "Tìm theo tiêu đề." }),
    (0, swagger_1.ApiQuery)({ name: "group", required: false, description: "Lọc theo 1 nhóm." }),
    (0, swagger_1.ApiQuery)({
        name: "groups",
        required: false,
        description: "Lọc theo nhiều nhóm (CSV), ví dụ: Doanh nghiệp,Công nghệ",
    }),
    (0, swagger_1.ApiQuery)({
        name: "ids",
        required: false,
        description: "CSV legacy_key để resolve giỏ hàng/yêu thích, ví dụ: tpl-01,tpl-02",
    }),
    (0, swagger_1.ApiQuery)({
        name: "price",
        required: false,
        description: "under_10m | 10m_15m | promo",
    }),
    (0, swagger_1.ApiQuery)({ name: "featured", required: false, description: "true | false" }),
    (0, swagger_1.ApiQuery)({ name: "page", required: false, example: "1" }),
    (0, swagger_1.ApiQuery)({ name: "limit", required: false, example: "24" }),
    (0, swagger_1.ApiOkResponse)({
        description: "Trả data + meta {page, limit, total, pageCount, filters}.",
    }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "list", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Tạo sản phẩm (chỉ admin)" }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: "Thiếu hoặc sai Bearer access token." }),
    (0, swagger_1.ApiForbiddenResponse)({ description: "Token hợp lệ nhưng không phải admin." }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("admin"),
    (0, swagger_1.ApiBody)({
        schema: {
            type: "object",
            required: ["title", "group_name", "price_vnd"],
            properties: {
                title: { type: "string", example: "Website E-commerce Nội thất" },
                slug: { type: "string", example: "website-ecommerce-noi-that" },
                group_name: { type: "string", example: "Doanh nghiệp" },
                price_vnd: { type: "number", example: 12000000 },
                featured: { type: "boolean", example: true },
            },
        },
    }),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Danh sách sản phẩm liên quan theo nhóm" }),
    (0, swagger_1.ApiParam)({ name: "slug", example: "website-ecommerce-noi-that" }),
    (0, swagger_1.ApiQuery)({ name: "limit", required: false, example: "12" }),
    (0, common_1.Get)(":slug/related"),
    __param(0, (0, common_1.Param)("slug")),
    __param(1, (0, common_1.Query)("limit")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "related", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Chi tiết sản phẩm theo slug" }),
    (0, swagger_1.ApiParam)({ name: "slug", example: "website-ecommerce-noi-that" }),
    (0, common_1.Get)(":slug"),
    __param(0, (0, common_1.Param)("slug")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "detail", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Cập nhật sản phẩm theo slug (chỉ admin)" }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: "Thiếu hoặc sai Bearer access token." }),
    (0, swagger_1.ApiForbiddenResponse)({ description: "Token hợp lệ nhưng không phải admin." }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("admin"),
    (0, swagger_1.ApiParam)({ name: "slug", example: "website-ecommerce-noi-that" }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: "object",
            properties: {
                title: { type: "string" },
                group_name: { type: "string" },
                price_vnd: { type: "number" },
                featured: { type: "boolean" },
                status: { type: "string", enum: ["draft", "active", "archived"] },
            },
        },
    }),
    (0, common_1.Patch)(":slug"),
    __param(0, (0, common_1.Param)("slug")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Xóa mềm sản phẩm theo slug (chỉ admin)" }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: "Thiếu hoặc sai Bearer access token." }),
    (0, swagger_1.ApiForbiddenResponse)({ description: "Token hợp lệ nhưng không phải admin." }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("admin"),
    (0, swagger_1.ApiParam)({ name: "slug", example: "website-ecommerce-noi-that" }),
    (0, common_1.Delete)(":slug"),
    __param(0, (0, common_1.Param)("slug")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "remove", null);
exports.ProductsController = ProductsController = __decorate([
    (0, swagger_1.ApiTags)("Products"),
    (0, common_1.Controller)("products"),
    __param(0, (0, common_1.Inject)(products_service_1.ProductsService)),
    __metadata("design:paramtypes", [products_service_1.ProductsService])
], ProductsController);
