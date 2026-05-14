import { Module } from "@nestjs/common";
import { AuthModule } from "@/modules/auth/auth.module";
import { CartController } from "./cart.controller";
import { CartService } from "./cart.service";

@Module({
  imports: [AuthModule],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
