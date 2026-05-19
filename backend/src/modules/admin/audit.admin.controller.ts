import {
  Controller,
  Get,
  Query,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from "@nestjs/swagger";
import { apiError } from "@/common/http-error";
import { Roles } from "../../common/decorators/roles.decorator";
import { RolesGuard } from "@/common/guards/roles.guard";
import { JwtAuthGuard } from "@/modules/auth/jwt-auth.guard";
import * as AuditRepository from "./audit.repository";

@ApiTags("Admin Audit Logs")
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: "Thiếu hoặc sai Bearer access token." })
@ApiForbiddenResponse({ description: "Token hợp lệ nhưng không phải admin." })
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("admin")
@Controller("admin/audit-logs")
export class AuditAdminController {
  @ApiOperation({ summary: "Danh sách nhật ký hệ thống (admin)" })
  @ApiQuery({ name: "page", required: false, example: 1 })
  @ApiQuery({ name: "pageSize", required: false, example: 25 })
  @ApiOkResponse({ description: "Trả về danh sách logs." })
  @Get()
  async list(
    @Query("page") pageStr?: string,
    @Query("pageSize") pageSizeStr?: string,
  ) {
    try {
      const page = pageStr ? Number.parseInt(pageStr, 10) : 1;
      const pageSize = pageSizeStr ? Number.parseInt(pageSizeStr, 10) : 25;
      
      const safePage = Math.max(1, page);
      const safePageSize = Math.min(100, Math.max(1, pageSize));
      const offset = (safePage - 1) * safePageSize;

      const [total, items] = await Promise.all([
        AuditRepository.countAuditLogs(),
        AuditRepository.listAuditLogs(safePageSize, offset),
      ]);

      return {
        ok: true,
        data: {
          items,
          total,
          page: safePage,
          pageSize: safePageSize,
        },
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      throw apiError(message);
    }
  }
}
