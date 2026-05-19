"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const node_path_1 = require("node:path");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const admin_module_1 = require("./modules/admin/admin.module");
const auth_module_1 = require("./modules/auth/auth.module");
const cart_module_1 = require("./modules/cart/cart.module");
const favorites_module_1 = require("./modules/favorites/favorites.module");
const health_module_1 = require("./modules/health/health.module");
const orders_module_1 = require("./modules/orders/orders.module");
const products_module_1 = require("./modules/products/products.module");
const users_module_1 = require("./modules/users/users.module");
/** Thư mục gói backend (chứa `.env`), ổn định khi cwd không phải `backend/`. */
const backendRoot = (0, node_path_1.join)(__dirname, "..");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: [
                    (0, node_path_1.join)(backendRoot, ".env"),
                    (0, node_path_1.join)(backendRoot, "..", "visstemp", ".env.local"),
                    (0, node_path_1.join)(backendRoot, "..", "visstemp", ".env"),
                ],
            }),
            health_module_1.HealthModule,
            products_module_1.ProductsModule,
            cart_module_1.CartModule,
            favorites_module_1.FavoritesModule,
            orders_module_1.OrdersModule,
            users_module_1.UsersModule,
            admin_module_1.AdminModule,
            auth_module_1.AuthModule,
        ],
    })
], AppModule);
