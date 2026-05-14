import {
  Body,
  Controller,
  Inject,
  HttpException,
  Patch,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
  ApiBody,
  ApiTags,
} from "@nestjs/swagger";
import { asPlainObject, apiError } from "@/common/http-error";
import { UsersMutationError } from "./users.errors";
import { JwtAuthGuard } from "@/modules/auth/jwt-auth.guard";
import { AuthUser, type JwtRequest } from "./users.types";
import { UsersService } from "./users.service";

@ApiTags("Users")
@Controller("users")
export class UsersController {
  constructor(@Inject(UsersService) private readonly users: UsersService) {}

  @ApiOperation({
    summary: "Cập nhật cài đặt cá nhân",
    description:
      "Yêu cầu Bearer token. Chỉ cần gửi field cần đổi; field không gửi sẽ giữ nguyên.",
  })
  @ApiBearerAuth()
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        display_name: { type: "string", example: "Nguyen Van A" },
        preferred_category: { type: "string", example: "Doanh nghiệp" },
        notify_promotions: { type: "boolean", example: true },
        notify_order_updates: { type: "boolean", example: true },
        show_profile_public: { type: "boolean", example: false },
      },
      example: {
        display_name: "Nguyen Van A",
        preferred_category: "Doanh nghiệp",
        notify_promotions: false,
      },
    },
  })
  @ApiOkResponse({
    description: "Cập nhật thành công.",
    schema: {
      type: "object",
      properties: {
        ok: { type: "boolean", example: true },
        data: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            email: { type: "string", format: "email" },
            name: { type: "string" },
            role: { type: "string", enum: ["admin", "staff", "customer"] },
            avatar_url: { type: "string", nullable: true },
            is_disabled: { type: "boolean" },
            settings: {
              type: "object",
              properties: {
                display_name: { type: "string" },
                preferred_category: { type: "string" },
                notify_promotions: { type: "boolean" },
                notify_order_updates: { type: "boolean" },
                show_profile_public: { type: "boolean" },
              },
            },
          },
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: "Body sai format (không phải object JSON).",
    schema: {
      type: "object",
      properties: {
        ok: { type: "boolean", example: false },
        error: { type: "string", example: "Payload phải là object JSON" },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: "Thiếu token / token sai / token hết hạn.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "number", example: 401 },
        message: { type: "string", example: "Unauthorized" },
      },
    },
  })
  @ApiNotFoundResponse({
    description: "Không tìm thấy user hiện tại.",
    schema: {
      type: "object",
      properties: {
        ok: { type: "boolean", example: false },
        error: { type: "string", example: "Không tìm thấy người dùng." },
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: "Lỗi hệ thống.",
    schema: {
      type: "object",
      properties: {
        ok: { type: "boolean", example: false },
        error: { type: "string", example: "Unknown error" },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  @Patch("settings")
  async updateSettings(
    @AuthUser() reqUser: JwtRequest["user"],
    @Body() body: unknown,
  ) {
    try {
      const data = await this.users.updateSettings(
        reqUser.sub,
        asPlainObject(body),
      );
      return { ok: true, data };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      if (error instanceof UsersMutationError) {
        throw apiError(error.message, error.statusCode);
      }
      const message = error instanceof Error ? error.message : "Unknown error";
      throw apiError(message, 500);
    }
  }
}
