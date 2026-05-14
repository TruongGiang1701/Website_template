import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { apiError, asPlainObject } from "@/common/http-error";
import { JwtAuthGuard } from "@/modules/auth/jwt-auth.guard";
import type { JwtPayload } from "@/modules/auth/jwt-payload";
import { AuthUser } from "@/modules/users/users.types";
import { OrdersMutationError } from "./orders.errors";
import { OrdersService } from "./orders.service";

function toOrdersError(error: unknown): never {
  if (error instanceof HttpException) throw error;
  if (error instanceof OrdersMutationError) {
    throw apiError(error.message, error.statusCode);
  }
  const message = error instanceof Error ? error.message : "Unknown error";
  throw apiError(message, HttpStatus.INTERNAL_SERVER_ERROR);
}

@ApiTags("Orders")
@ApiBearerAuth()
@Controller("orders")
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(@Inject(OrdersService) private readonly orders: OrdersService) {}

  @ApiOperation({
    summary: "Checkout - tạo đơn hàng từ giỏ hiện tại",
    description:
      "Lấy toàn bộ `cart_items` từ giỏ hiện tại của user, tính subtotal/total, tạo `orders` + `order_items` + `order_events`, sau đó clear giỏ.",
  })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        contact_name: { type: "string", example: "Nguyen Van A" },
        contact_email: {
          type: "string",
          format: "email",
          example: "a@example.com",
        },
        note: {
          type: "string",
          example: "Cần triển khai trong 2 tuần, ưu tiên mobile first.",
        },
      },
    },
  })
  @ApiOkResponse({
    description:
      "Tạo đơn thành công. Response trả chi tiết đơn gồm items snapshot và events.",
  })
  @ApiBadRequestResponse({
    description: "Giỏ trống hoặc payload sai định dạng.",
  })
  @ApiUnauthorizedResponse({ description: "Thiếu hoặc sai access token." })
  @Post()
  async create(@AuthUser() user: JwtPayload, @Body() body: unknown) {
    try {
      const payload = asPlainObject(body);
      const data = await this.orders.create(user.sub, {
        contact_name:
          typeof payload.contact_name === "string"
            ? payload.contact_name
            : typeof payload.contactName === "string"
              ? payload.contactName
              : undefined,
        contact_email:
          typeof payload.contact_email === "string"
            ? payload.contact_email
            : typeof payload.contactEmail === "string"
              ? payload.contactEmail
              : undefined,
        note: typeof payload.note === "string" ? payload.note : undefined,
      });
      return { ok: true, data };
    } catch (error) {
      return toOrdersError(error);
    }
  }

  @ApiOperation({
    summary: "Lịch sử đơn hàng của user hiện tại",
    description: "Trả danh sách đơn theo `created_at DESC`.",
  })
  @ApiOkResponse({
    description: "Danh sách đơn hàng.",
  })
  @ApiUnauthorizedResponse({ description: "Thiếu hoặc sai access token." })
  @Get()
  async list(@AuthUser() user: JwtPayload) {
    try {
      const data = await this.orders.list(user.sub);
      return { ok: true, data };
    } catch (error) {
      return toOrdersError(error);
    }
  }

  @ApiOperation({
    summary: "Chi tiết đơn hàng theo mã code",
    description: "Chỉ truy cập được đơn hàng của chính user đang đăng nhập.",
  })
  @ApiParam({ name: "code", example: "ORD-20260512-181015-AB12C" })
  @ApiOkResponse({ description: "Chi tiết đơn hàng + items + events." })
  @ApiNotFoundResponse({ description: "Không tìm thấy đơn hàng." })
  @ApiUnauthorizedResponse({ description: "Thiếu hoặc sai access token." })
  @Get(":code")
  async detail(@AuthUser() user: JwtPayload, @Param("code") code: string) {
    try {
      const decoded = decodeURIComponent(code ?? "").trim();
      if (!decoded)
        throw apiError("Thiếu mã đơn hàng.", HttpStatus.BAD_REQUEST);
      const data = await this.orders.detailByCode(user.sub, decoded);
      return { ok: true, data };
    } catch (error) {
      return toOrdersError(error);
    }
  }
}
