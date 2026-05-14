import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Inject,
  Post,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
  ApiBody,
  ApiTags,
} from "@nestjs/swagger";
import { asPlainObject, apiError } from "@/common/http-error";
import { Roles } from "@/common/decorators/roles.decorator";
import { RolesGuard } from "@/common/guards/roles.guard";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { AuthUser, type JwtRequest } from "../users/users.types";

const authSuccessSchema = {
  type: "object",
  properties: {
    ok: { type: "boolean", example: true },
    data: {
      type: "object",
      properties: {
        token: {
          type: "string",
          example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyZjQ...kB0",
        },
        accessToken: {
          type: "string",
          example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.access-token",
        },
        refreshToken: {
          type: "string",
          example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.refresh-token",
        },
        tokenType: {
          type: "string",
          example: "Bearer",
        },
        accessExpiresIn: {
          type: "string",
          example: "15m",
        },
        refreshExpiresIn: {
          type: "string",
          example: "30d",
        },
        user: {
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
  },
};

const authErrorSchema = {
  type: "object",
  properties: {
    ok: { type: "boolean", example: false },
    error: { type: "string", example: "Thiếu name, email hoặc password." },
  },
};

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(@Inject(AuthService) private readonly auth: AuthService) {}

  @ApiOperation({
    summary: "Đăng ký tài khoản",
    description:
      "Tạo user mới (role customer), hash password bằng bcrypt, tạo user_settings mặc định và trả access token + refresh token.",
  })
  @ApiBody({
    schema: {
      type: "object",
      required: ["name", "email", "password"],
      properties: {
        name: { type: "string", example: "Nguyen Van A" },
        email: {
          type: "string",
          format: "email",
          example: "nguyenvana@example.com",
        },
        password: { type: "string", example: "StrongPass123!" },
      },
    },
  })
  @ApiCreatedResponse({
    description: "Đăng ký thành công.",
    schema: authSuccessSchema,
  })
  @ApiBadRequestResponse({
    description:
      "Thiếu field, email không đúng định dạng, hoặc password không hợp lệ.",
    schema: authErrorSchema,
  })
  @ApiConflictResponse({
    description: "Email đã tồn tại.",
    schema: {
      type: "object",
      properties: {
        ok: { type: "boolean", example: false },
        error: { type: "string", example: "Email đã tồn tại." },
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
  @Post("register")
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() body: unknown) {
    try {
      const data = await this.auth.register(asPlainObject(body));
      return { ok: true, data };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      const message = error instanceof Error ? error.message : "Unknown error";
      throw apiError(message, 500);
    }
  }

  @ApiOperation({
    summary: "Đăng nhập",
    description:
      "Xác thực email/password. Thành công trả access token + refresh token + thông tin user.",
  })
  @ApiBody({
    schema: {
      type: "object",
      required: ["email", "password"],
      properties: {
        email: {
          type: "string",
          format: "email",
          example: "nguyenvana@example.com",
        },
        password: { type: "string", example: "StrongPass123!" },
      },
    },
  })
  @ApiOkResponse({
    description: "Đăng nhập thành công.",
    schema: authSuccessSchema,
  })
  @ApiBadRequestResponse({
    description: "Thiếu email/password hoặc email không đúng định dạng.",
    schema: {
      type: "object",
      properties: {
        ok: { type: "boolean", example: false },
        error: {
          type: "string",
          example: "Email không đúng định dạng.",
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: "Sai thông tin đăng nhập.",
    schema: {
      type: "object",
      properties: {
        ok: { type: "boolean", example: false },
        error: { type: "string", example: "Sai email hoặc password." },
      },
    },
  })
  @ApiForbiddenResponse({
    description: "Tài khoản bị khóa.",
    schema: {
      type: "object",
      properties: {
        ok: { type: "boolean", example: false },
        error: { type: "string", example: "Tài khoản đã bị khóa." },
      },
    },
  })
  @ApiNotFoundResponse({
    description: "Tài khoản hợp lệ nhưng không đọc được profile.",
    schema: {
      type: "object",
      properties: {
        ok: { type: "boolean", example: false },
        error: { type: "string", example: "Không tìm thấy hồ sơ người dùng." },
      },
    },
  })
  @Post("login")
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: unknown) {
    try {
      const data = await this.auth.login(asPlainObject(body));
      return { ok: true, data };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      const message = error instanceof Error ? error.message : "Unknown error";
      throw apiError(message, 500);
    }
  }

  @ApiTags("Admin")
  @ApiOperation({
    summary: "Đăng nhập Admin (console quản trị)",
    description:
      "Xác thực email/password từ bảng `users`. Chỉ tài khoản có `role = 'admin'` mới nhận token; tài khoản khác nhận 401 (không phân biệt lý do).",
  })
  @ApiBody({
    schema: {
      type: "object",
      required: ["email", "password"],
      properties: {
        email: {
          type: "string",
          format: "email",
          example: "admin@example.com",
        },
        password: { type: "string", example: "StrongPass123!" },
      },
    },
  })
  @ApiOkResponse({
    description: "Đăng nhập admin thành công.",
    schema: authSuccessSchema,
  })
  @ApiBadRequestResponse({
    description: "Thiếu email/password hoặc email không đúng định dạng.",
    schema: {
      type: "object",
      properties: {
        ok: { type: "boolean", example: false },
        error: { type: "string", example: "Email không đúng định dạng." },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: "Sai email/password, hoặc tài khoản không phải admin.",
    schema: {
      type: "object",
      properties: {
        ok: { type: "boolean", example: false },
        error: { type: "string", example: "Sai email hoặc password." },
      },
    },
  })
  @ApiForbiddenResponse({
    description: "Tài khoản admin bị khóa.",
    schema: {
      type: "object",
      properties: {
        ok: { type: "boolean", example: false },
        error: { type: "string", example: "Tài khoản đã bị khóa." },
      },
    },
  })
  @Post("admin/login")
  @HttpCode(HttpStatus.OK)
  async adminLogin(@Body() body: unknown) {
    try {
      const data = await this.auth.adminLogin(asPlainObject(body));
      return { ok: true, data };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      const message = error instanceof Error ? error.message : "Unknown error";
      throw apiError(message, 500);
    }
  }

  @ApiOperation({
    summary: "Làm mới access token",
    description:
      "Gửi `refreshToken` (JWT có `token_use: refresh`). Trả về cặp token mới + profile (rotation refresh).",
  })
  @ApiBody({
    schema: {
      type: "object",
      required: ["refreshToken"],
      properties: {
        refreshToken: {
          type: "string",
          example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        },
      },
    },
  })
  @ApiOkResponse({
    description: "Cấp token mới thành công.",
    schema: authSuccessSchema,
  })
  @ApiBadRequestResponse({
    description: "Thiếu refreshToken.",
    schema: authErrorSchema,
  })
  @ApiUnauthorizedResponse({
    description: "Refresh token sai / hết hạn / không phải refresh token.",
    schema: {
      type: "object",
      properties: {
        ok: { type: "boolean", example: false },
        error: {
          type: "string",
          example: "Refresh token không hợp lệ hoặc đã hết hạn.",
        },
      },
    },
  })
  @ApiForbiddenResponse({
    description: "Tài khoản bị khóa.",
    schema: {
      type: "object",
      properties: {
        ok: { type: "boolean", example: false },
        error: { type: "string", example: "Tài khoản đã bị khóa." },
      },
    },
  })
  @ApiNotFoundResponse({
    description: "User không còn tồn tại.",
    schema: {
      type: "object",
      properties: {
        ok: { type: "boolean", example: false },
        error: { type: "string", example: "Không tìm thấy người dùng." },
      },
    },
  })
  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() body: unknown) {
    try {
      const data = await this.auth.refresh(asPlainObject(body));
      return { ok: true, data };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      const message = error instanceof Error ? error.message : "Unknown error";
      throw apiError(message, 500);
    }
  }

  @ApiOperation({
    summary: "Lấy thông tin tài khoản hiện tại",
    description:
      "Yêu cầu Bearer token hợp lệ. Trả về user + user_settings hiện tại.",
  })
  @ApiBearerAuth()
  @ApiOkResponse({
    description: "Lấy thông tin thành công.",
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
    description: "User id trong token không còn tồn tại.",
    schema: {
      type: "object",
      properties: {
        ok: { type: "boolean", example: false },
        error: { type: "string", example: "Không tìm thấy người dùng." },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  @Get("me")
  async me(@AuthUser() reqUser: JwtRequest["user"]) {
    const data = await this.auth.me(reqUser.sub);
    return { ok: true, data };
  }

  @ApiTags("Admin")
  @ApiOperation({
    summary: "Lấy hồ sơ admin hiện tại (từ DB)",
    description:
      "Bearer access token. Yêu cầu `role = admin` trong JWT; dùng để admin-web xác minh phiên sau khi đăng nhập.",
  })
  @ApiBearerAuth()
  @ApiOkResponse({
    description: "Thành công.",
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
            role: { type: "string", example: "admin" },
          },
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: "Thiếu token / token sai / token hết hạn.",
  })
  @ApiForbiddenResponse({ description: "Token hợp lệ nhưng không phải admin." })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  @Get("admin/me")
  async adminMe(@AuthUser() reqUser: JwtRequest["user"]) {
    const data = await this.auth.me(reqUser.sub);
    return { ok: true, data };
  }
}
