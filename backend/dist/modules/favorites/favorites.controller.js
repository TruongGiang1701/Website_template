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
exports.FavoritesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const http_error_1 = require("../../common/http-error");
const jwt_auth_guard_1 = require("../../modules/auth/jwt-auth.guard");
const users_types_1 = require("../../modules/users/users.types");
const favorites_errors_1 = require("./favorites.errors");
const favorites_service_1 = require("./favorites.service");
function toFavoritesError(error) {
    if (error instanceof common_1.HttpException)
        throw error;
    if (error instanceof favorites_errors_1.FavoritesMutationError) {
        throw (0, http_error_1.apiError)(error.message, error.statusCode);
    }
    const message = error instanceof Error ? error.message : "Unknown error";
    throw (0, http_error_1.apiError)(message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
}
let FavoritesController = class FavoritesController {
    favorites;
    constructor(favorites) {
        this.favorites = favorites;
    }
    async list(user) {
        try {
            const data = await this.favorites.list(user.sub);
            return { ok: true, data };
        }
        catch (error) {
            return toFavoritesError(error);
        }
    }
    async add(user, body) {
        try {
            const json = (0, http_error_1.asPlainObject)(body);
            const productId = typeof json.productId === "string" ? json.productId.trim() : "";
            if (!productId) {
                throw (0, http_error_1.apiError)("Thiếu productId.", common_1.HttpStatus.BAD_REQUEST);
            }
            await this.favorites.add(user.sub, productId);
            const data = await this.favorites.list(user.sub);
            return { ok: true, data };
        }
        catch (error) {
            return toFavoritesError(error);
        }
    }
    async remove(user, productIdRaw) {
        try {
            const productId = decodeURIComponent(productIdRaw ?? "").trim();
            if (!productId) {
                throw (0, http_error_1.apiError)("Thiếu productId.", common_1.HttpStatus.BAD_REQUEST);
            }
            const removed = await this.favorites.remove(user.sub, productId);
            if (!removed) {
                throw (0, http_error_1.apiError)("Sản phẩm chưa có trong yêu thích.", common_1.HttpStatus.NOT_FOUND);
            }
            const data = await this.favorites.list(user.sub);
            return { ok: true, data };
        }
        catch (error) {
            return toFavoritesError(error);
        }
    }
};
exports.FavoritesController = FavoritesController;
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: "Danh sách yêu thích",
        description: "Bearer access token.",
    }),
    (0, swagger_1.ApiOkResponse)({ description: "Danh sách sản phẩm đang bán." }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: "Thiếu hoặc sai token." }),
    (0, common_1.Get)(),
    __param(0, (0, users_types_1.AuthUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FavoritesController.prototype, "list", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: "Thêm yêu thích",
        description: "`productId`: uuid, legacy_key hoặc slug.",
    }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: "object",
            required: ["productId"],
            properties: { productId: { type: "string", example: "tpl-01" } },
        },
    }),
    (0, common_1.Post)(),
    __param(0, (0, users_types_1.AuthUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FavoritesController.prototype, "add", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: "Bỏ yêu thích",
        description: "`productId` trong path: uuid, legacy_key hoặc slug (encode URI nếu cần).",
    }),
    (0, swagger_1.ApiParam)({ name: "productId", example: "tpl-01" }),
    (0, common_1.Delete)(":productId"),
    __param(0, (0, users_types_1.AuthUser)()),
    __param(1, (0, common_1.Param)("productId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], FavoritesController.prototype, "remove", null);
exports.FavoritesController = FavoritesController = __decorate([
    (0, swagger_1.ApiTags)("Favorites"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)("favorites"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Inject)(favorites_service_1.FavoritesService)),
    __metadata("design:paramtypes", [favorites_service_1.FavoritesService])
], FavoritesController);
