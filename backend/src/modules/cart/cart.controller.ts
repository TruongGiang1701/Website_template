import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  HttpException,
  HttpStatus,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { apiError, asPlainObject } from "@/common/http-error";
import {
  getOrCreateGuestSessionId,
  setGuestCartSessionCookie,
} from "@/lib/cart/guest-session-cookie";
import { JwtAuthGuard } from "@/modules/auth/jwt-auth.guard";
import type { JwtPayload } from "@/modules/auth/jwt-payload";
import { OptionalJwtAuthGuard } from "@/modules/auth/optional-jwt-auth.guard";
import { AuthUser } from "@/modules/users/users.types";
import { CartMutationError } from "./cart.errors";
import { CartService } from "./cart.service";

type CookieRequest = {
  cookies?: Record<string, string | undefined>;
};

type CookieWritableResponse = {
  cookie: (
    name: string,
    value: string,
    options: {
      httpOnly: boolean;
      sameSite: "lax";
      path: string;
      maxAge: number;
      secure: boolean;
    },
  ) => unknown;
};

function cookieSecure() {
  return process.env.NODE_ENV === "production";
}

function parseQty(raw: unknown): number | null {
  if (typeof raw === "number" && Number.isFinite(raw)) return raw;
  if (typeof raw === "string" && raw.trim().length > 0) {
    const n = Number.parseInt(raw, 10);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

function toCartError(error: unknown): never {
  if (error instanceof HttpException) throw error;
  if (error instanceof CartMutationError) {
    throw apiError(error.message, error.statusCode);
  }
  const message = error instanceof Error ? error.message : "Unknown error";
  const status =
    message.includes("JSON") || message.includes("Body")
      ? HttpStatus.BAD_REQUEST
      : HttpStatus.INTERNAL_SERVER_ERROR;
  throw apiError(message, status);
}

@ApiTags("Cart")
@Controller("cart")
export class CartController {
  constructor(@Inject(CartService) private readonly cart: CartService) {}

  @ApiOperation({
    summary: "Lấy giỏ hàng hiện tại (user nếu đã login, guest nếu chưa)",
    description:
      "Nếu có Bearer access token hợp lệ → trả giỏ theo user. Nếu chưa login → dùng cookie guest (`visstemp_guest_cart_sid`). Nếu chưa có cookie sẽ tự tạo và trả giỏ rỗng.",
  })
  @ApiOkResponse({
    description: "Trả về snapshot giỏ hàng hiện tại.",
  })
  @Get()
  @UseGuards(OptionalJwtAuthGuard)
  async getCart(
    @Req() req: CookieRequest,
    @Res({ passthrough: true }) res: CookieWritableResponse,
  ) {
    try {
      const user = (req as unknown as { user?: JwtPayload }).user;
      if (user?.sub) {
        const data = await this.cart.getUser(user.sub);
        return { ok: true, data };
      }
      const { sessionId, isNew } = getOrCreateGuestSessionId(req.cookies ?? {});
      const data = await this.cart.getGuest(sessionId);
      if (isNew) setGuestCartSessionCookie(res, sessionId, cookieSecure());
      return { ok: true, data };
    } catch (error) {
      return toCartError(error);
    }
  }

  @ApiOperation({
    summary: "Gộp giỏ guest vào user sau login",
    description:
      "Yêu cầu Bearer access token + cookie guest hiện tại. Swagger không tự giữ cookie của trình duyệt nếu mở tab mới, nên để test merge thật nên gọi từ cùng session hoặc Postman.",
  })
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: "Thiếu hoặc sai access token." })
  @ApiOkResponse({
    description: "Gộp thành công, trả về giỏ sau gộp của user.",
  })
  @Post("merge")
  @UseGuards(JwtAuthGuard)
  async mergeCart(
    @Req() req: CookieRequest,
    @Res({ passthrough: true }) res: CookieWritableResponse,
    @AuthUser() user: JwtPayload,
  ) {
    try {
      const { sessionId, isNew } = getOrCreateGuestSessionId(req.cookies ?? {});
      const data = await this.cart.mergeGuestIntoUser(sessionId, user.sub);
      if (isNew) setGuestCartSessionCookie(res, sessionId, cookieSecure());
      return { ok: true, data };
    } catch (error) {
      return toCartError(error);
    }
  }

  @ApiOperation({
    summary: "Thêm/cập nhật số lượng sản phẩm trong giỏ",
    description:
      "Nếu có Bearer access token hợp lệ → cập nhật giỏ theo user. Nếu chưa login → cập nhật giỏ guest theo cookie. `productId` chấp nhận uuid, `legacy_key` (vd `tpl-01`) hoặc `slug`.",
  })
  @ApiBody({
    schema: {
      type: "object",
      required: ["productId", "qty"],
      properties: {
        productId: { type: "string", example: "tpl-01" },
        qty: { type: "number", example: 2, minimum: 1 },
      },
    },
  })
  @ApiOkResponse({
    description: "Cập nhật thành công và trả giỏ mới nhất.",
  })
  @Post("items")
  @UseGuards(OptionalJwtAuthGuard)
  async upsertItem(
    @Req() req: CookieRequest,
    @Res({ passthrough: true }) res: CookieWritableResponse,
    @Body() body: unknown,
  ) {
    try {
      const user = (req as unknown as { user?: JwtPayload }).user;
      const { sessionId, isNew } = getOrCreateGuestSessionId(req.cookies ?? {});
      const json = asPlainObject(body);
      const productId =
        typeof json.productId === "string" ? json.productId.trim() : "";
      const qty = parseQty(json.qty);

      if (!productId) {
        throw apiError(
          "Thiếu productId (uuid, legacy_key hoặc slug)",
          HttpStatus.BAD_REQUEST,
        );
      }
      if (qty === null || qty < 1) {
        throw apiError("qty phải là số nguyên ≥ 1", HttpStatus.BAD_REQUEST);
      }

      if (user?.sub) {
        await this.cart.upsertUserItem(user.sub, productId, qty);
        const data = await this.cart.getUser(user.sub);
        return { ok: true, data };
      }

      await this.cart.upsertGuestItem(sessionId, productId, qty);
      const data = await this.cart.getGuest(sessionId);
      if (isNew) setGuestCartSessionCookie(res, sessionId, cookieSecure());
      return { ok: true, data };
    } catch (error) {
      return toCartError(error);
    }
  }

  @ApiOperation({
    summary: "Xóa một sản phẩm khỏi giỏ",
  })
  @ApiQuery({
    name: "productId",
    required: true,
    description: "uuid, legacy_key hoặc slug của sản phẩm cần xóa.",
    example: "tpl-01",
  })
  @ApiOkResponse({
    description: "Xóa xong và trả snapshot giỏ mới.",
  })
  @Delete("items")
  @UseGuards(OptionalJwtAuthGuard)
  async removeItem(
    @Req() req: CookieRequest,
    @Res({ passthrough: true }) res: CookieWritableResponse,
    @Query("productId") productIdRaw?: string,
  ) {
    try {
      const productId = productIdRaw?.trim() ?? "";
      if (!productId) {
        throw apiError("Thiếu query productId", HttpStatus.BAD_REQUEST);
      }

      const user = (req as unknown as { user?: JwtPayload }).user;
      const { sessionId, isNew } = getOrCreateGuestSessionId(req.cookies ?? {});

      if (user?.sub) {
        await this.cart.removeUserItem(user.sub, productId);
        const data = await this.cart.getUser(user.sub);
        return { ok: true, data };
      }

      await this.cart.removeGuestItem(sessionId, productId);
      const data = await this.cart.getGuest(sessionId);
      if (isNew) setGuestCartSessionCookie(res, sessionId, cookieSecure());
      return { ok: true, data };
    } catch (error) {
      return toCartError(error);
    }
  }
}
