import { Controller, Get, UseGuards } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from "@nestjs/swagger";
import { apiError } from "@/common/http-error";
import { Roles } from "../../common/decorators/roles.decorator";
import { RolesGuard } from "@/common/guards/roles.guard";
import { JwtAuthGuard } from "@/modules/auth/jwt-auth.guard";
import * as DashboardRepository from "./dashboard.repository";

@ApiTags("Admin Dashboard")
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: "Thiếu hoặc sai Bearer access token." })
@ApiForbiddenResponse({ description: "Token hợp lệ nhưng không phải admin." })
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("admin")
@Controller("admin/dashboard")
export class DashboardAdminController {
  @ApiOperation({ summary: "Lấy số liệu thống kê Dashboard (admin)" })
  @ApiOkResponse({ description: "Trả về dữ liệu tổng quan cho trang chủ admin." })
  @Get("metrics")
  async getMetrics() {
    try {
      const data = await DashboardRepository.getDashboardMetrics();
      return { ok: true, data };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      throw apiError(message);
    }
  }
}
