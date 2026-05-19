import { join } from "node:path";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ServeStaticModule } from "@nestjs/serve-static";
import { AdminModule } from "@/modules/admin/admin.module";
import { AuthModule } from "@/modules/auth/auth.module";
import { CartModule } from "@/modules/cart/cart.module";
import { FavoritesModule } from "@/modules/favorites/favorites.module";
import { HealthModule } from "@/modules/health/health.module";
import { OrdersModule } from "@/modules/orders/orders.module";
import { ProductsModule } from "@/modules/products/products.module";
import { UsersModule } from "@/modules/users/users.module";

/** Thư mục gói backend (chứa `.env`), ổn định khi cwd không phải `backend/`. */
const backendRoot = join(__dirname, "..");

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        join(backendRoot, ".env"),
        join(backendRoot, "..", "visstemp", ".env.local"),
        join(backendRoot, "..", "visstemp", ".env"),
      ],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(backendRoot, "public"),
      serveRoot: "/public",
    }),
    HealthModule,
    ProductsModule,
    CartModule,
    FavoritesModule,
    OrdersModule,
    UsersModule,
    AdminModule,
    AuthModule,
  ],
})
export class AppModule {}
