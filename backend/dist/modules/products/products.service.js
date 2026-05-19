"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const products_mutations_1 = require("./products.mutations");
const products_repository_1 = require("./products.repository");
let ProductsService = class ProductsService {
    count(filters) {
        return (0, products_repository_1.countProducts)(filters);
    }
    list(filters, limit, offset) {
        return (0, products_repository_1.listProducts)(filters, limit, offset);
    }
    meta() {
        return (0, products_repository_1.getPublicProductCatalogStats)();
    }
    detail(slug) {
        return (0, products_repository_1.getProductDetailBySlug)(slug, "public");
    }
    related(excludeSlug, groupName, limit) {
        return (0, products_repository_1.listRelatedPublicProducts)(excludeSlug, groupName, limit);
    }
    create(raw) {
        return (0, products_mutations_1.createProduct)(raw);
    }
    update(slug, raw) {
        return (0, products_mutations_1.updateProductBySlug)(slug, raw);
    }
    softDelete(slug) {
        return (0, products_mutations_1.softDeleteProductBySlug)(slug);
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)()
], ProductsService);
