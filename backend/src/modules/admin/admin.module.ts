import { Module } from "@nestjs/common";
import { OrdersAdminController } from "./orders.admin.controller";
import { UsersAdminController } from "./users.admin.controller";
import { ProductsAdminController } from "./products.admin.controller";
import { AuditAdminController } from "./audit.admin.controller";
import { DashboardAdminController } from "./dashboard.admin.controller";
import { CategoriesAdminController } from "./categories.admin.controller";
import { MediaAdminController } from "./media.admin.controller";

/**
 * Module dành cho các route `/api/admin/*` (orders, users, products, audit, …).
 * Import vào `AppModule`; các controller con sẽ đăng ký tại đây khi triển khai từng API.
 */
@Module({
  imports: [],
  controllers: [
    OrdersAdminController,
    UsersAdminController,
    ProductsAdminController,
    AuditAdminController,
    DashboardAdminController,
    CategoriesAdminController,
    MediaAdminController,
  ],
  providers: [],
})
export class AdminModule {}
