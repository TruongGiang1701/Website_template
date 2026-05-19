import {
  Controller,
  Get,
  Inject,
  HttpStatus,
  Param,
  Patch,
  Query,
  UseGuards,
  Body,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from "@nestjs/swagger";
import { apiError } from "@/common/http-error";
import { Roles } from "../../common/decorators/roles.decorator";
import { RolesGuard } from "@/common/guards/roles.guard";
import { JwtAuthGuard } from "@/modules/auth/jwt-auth.guard";
import { CurrentUser } from "../../common/decorators/user.decorator";
import type { JwtPayload } from "@/modules/auth/jwt-payload";
import * as OrdersRepository from "@/modules/orders/orders.repository";
import type { OrderStatus } from "@/types/orders";

@ApiTags("Admin Orders")
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: "Thiếu hoặc sai Bearer access token." })
@ApiForbiddenResponse({ description: "Token hợp lệ nhưng không phải admin." })
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("admin")
@Controller("admin/orders")
export class OrdersAdminController {
  @ApiOperation({ summary: "Danh sách toàn bộ đơn hàng (admin)" })
  @ApiQuery({ name: "page", required: false, example: 1 })
  @ApiQuery({ name: "pageSize", required: false, example: 20 })
  @ApiQuery({ name: "status", required: false, description: "Lọc theo status" })
  @ApiQuery({ name: "payment_status", required: false, description: "Lọc theo payment status" })
  @ApiQuery({ name: "q", required: false, description: "Tìm kiếm theo code hoặc email" })
  @ApiOkResponse({ description: "Trả về danh sách đơn hàng có phân trang." })
  @Get()
  async list(
    @Query("page") page?: string,
    @Query("pageSize") pageSize?: string,
    @Query("status") status?: string,
    @Query("payment_status") paymentStatus?: string,
    @Query("q") q?: string,
  ) {
    try {
      const result = await OrdersRepository.listOrdersForAdmin({
        page: page ? Number.parseInt(page, 10) : 1,
        pageSize: pageSize ? Number.parseInt(pageSize, 10) : 20,
        status: status || null,
        payment_status: paymentStatus || null,
        q: q || null,
      });
      return { ok: true, data: result };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      throw apiError(message);
    }
  }

  @ApiOperation({ summary: "Chi tiết đơn hàng (admin)" })
  @ApiParam({ name: "id", description: "UUID của đơn hàng" })
  @ApiOkResponse({ description: "Trả về chi tiết đơn hàng, items và timeline." })
  @Get(":id")
  async detail(@Param("id") id: string) {
    try {
      const data = await OrdersRepository.getOrderByIdForAdmin(id);
      return { ok: true, data };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      const status = message.includes("không tìm thấy") ? HttpStatus.NOT_FOUND : HttpStatus.INTERNAL_SERVER_ERROR;
      throw apiError(message, status);
    }
  }

  @ApiOperation({ summary: "Cập nhật ghi chú nội bộ (admin)" })
  @ApiParam({ name: "id", description: "UUID của đơn hàng" })
  @ApiOkResponse({ description: "Trả về chi tiết đơn hàng sau khi cập nhật." })
  @Patch(":id/admin-notes")
  async updateAdminNotes(
    @Param("id") id: string,
    @Body("admin_notes") adminNotes: string,
    @CurrentUser() user: JwtPayload,
  ) {
    try {
      const data = await OrdersRepository.updateAdminNotes(id, user.sub, adminNotes ?? "");
      return { ok: true, data };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      const status = message.includes("không tìm thấy") ? HttpStatus.NOT_FOUND : HttpStatus.INTERNAL_SERVER_ERROR;
      throw apiError(message, status);
    }
  }

  @ApiOperation({ summary: "Cập nhật trạng thái đơn hàng (admin)" })
  @ApiParam({ name: "id", description: "UUID của đơn hàng" })
  @ApiOkResponse({ description: "Trả về chi tiết đơn hàng sau khi cập nhật." })
  @Patch(":id/status")
  async updateStatus(
    @Param("id") id: string,
    @Body("status") status: OrderStatus,
    @CurrentUser() user: JwtPayload,
  ) {
    try {
      if (!status) {
        throw apiError("Thiếu trạng thái đơn hàng.", HttpStatus.BAD_REQUEST);
      }
      const data = await OrdersRepository.patchOrderStatusForAdmin(id, user.sub, status);
      return { ok: true, data };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      throw apiError(message);
    }
  }
}
