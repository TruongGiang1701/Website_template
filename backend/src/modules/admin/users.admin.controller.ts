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
  ForbiddenException,
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
import * as UsersRepository from "@/modules/users/users.repository";

@ApiTags("Admin Users")
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: "Thiếu hoặc sai Bearer access token." })
@ApiForbiddenResponse({ description: "Token hợp lệ nhưng không phải admin." })
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("admin")
@Controller("admin/users")
export class UsersAdminController {
  @ApiOperation({ summary: "Danh sách người dùng (admin)" })
  @ApiQuery({ name: "page", required: false, example: 1 })
  @ApiQuery({ name: "pageSize", required: false, example: 20 })
  @ApiQuery({ name: "q", required: false, description: "Tìm kiếm theo email hoặc tên" })
  @ApiOkResponse({ description: "Trả về danh sách người dùng có phân trang." })
  @Get()
  async list(
    @Query("page") page?: string,
    @Query("pageSize") pageSize?: string,
    @Query("q") q?: string,
  ) {
    try {
      const result = await UsersRepository.listUsersForAdmin({
        page: page ? Number.parseInt(page, 10) : 1,
        pageSize: pageSize ? Number.parseInt(pageSize, 10) : 20,
        q: q || null,
      });
      return { ok: true, data: result };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      throw apiError(message);
    }
  }

  @ApiOperation({ summary: "Chi tiết người dùng (admin)" })
  @ApiParam({ name: "id", description: "UUID của người dùng" })
  @ApiOkResponse({ description: "Trả về chi tiết người dùng, số đơn hàng và tổng chi tiêu." })
  @Get(":id")
  async detail(@Param("id") id: string) {
    try {
      const data = await UsersRepository.getUserDetailForAdmin(id);
      if (!data) {
        throw apiError("Không tìm thấy người dùng.", HttpStatus.NOT_FOUND);
      }
      return { ok: true, data };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      const status = message.includes("không tìm thấy") ? HttpStatus.NOT_FOUND : HttpStatus.INTERNAL_SERVER_ERROR;
      throw apiError(message, status);
    }
  }

  @ApiOperation({ summary: "Khóa/Mở khóa tài khoản (admin)" })
  @ApiParam({ name: "id", description: "UUID của người dùng" })
  @ApiOkResponse({ description: "Trả về chi tiết người dùng sau khi cập nhật." })
  @Patch(":id/disable")
  async toggleDisable(
    @Param("id") id: string,
    @Body("is_disabled") isDisabled: boolean,
  ) {
    try {
      const data = await UsersRepository.toggleUserDisabledStatus(id, isDisabled);
      return { ok: true, data };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      throw apiError(message);
    }
  }

  @ApiOperation({ summary: "Cập nhật vai trò (chỉ Super Admin)" })
  @ApiParam({ name: "id", description: "UUID của người dùng" })
  @ApiOkResponse({ description: "Trả về chi tiết người dùng sau khi cập nhật." })
  @Patch(":id/role")
  async updateRole(
    @Param("id") id: string,
    @Body("role") role: string,
    @CurrentUser() admin: JwtPayload,
  ) {
    try {
      // Giả định: super admin là role 'admin'. Staff có thể là 'admin' ở tầng Controller chung
      // nhưng ở đây user yêu cầu "Chỉ Super Admin mới gọi được".
      // Nếu dự án có phân cấp admin, ta check ở đây.
      // Hiện tại ta chỉ cho phép admin (nếu role hệ thống chỉ có 3 role admin, staff, customer)
      if (admin.role !== "admin") {
        throw new ForbiddenException("Chỉ Admin cấp cao mới có quyền thay đổi vai trò.");
      }

      const data = await UsersRepository.updateUserRole(id, role);
      return { ok: true, data };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      throw apiError(message);
    }
  }
}
