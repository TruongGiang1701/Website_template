import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
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
import { FavoritesMutationError } from "./favorites.errors";
import { FavoritesService } from "./favorites.service";

function toFavoritesError(error: unknown): never {
  if (error instanceof HttpException) throw error;
  if (error instanceof FavoritesMutationError) {
    throw apiError(error.message, error.statusCode);
  }
  const message = error instanceof Error ? error.message : "Unknown error";
  throw apiError(message, HttpStatus.INTERNAL_SERVER_ERROR);
}

@ApiTags("Favorites")
@ApiBearerAuth()
@Controller("favorites")
@UseGuards(JwtAuthGuard)
export class FavoritesController {
  constructor(
    @Inject(FavoritesService) private readonly favorites: FavoritesService,
  ) {}

  @ApiOperation({
    summary: "Danh sách yêu thích",
    description: "Bearer access token.",
  })
  @ApiOkResponse({ description: "Danh sách sản phẩm đang bán." })
  @ApiUnauthorizedResponse({ description: "Thiếu hoặc sai token." })
  @Get()
  async list(@AuthUser() user: JwtPayload) {
    try {
      const data = await this.favorites.list(user.sub);
      return { ok: true, data };
    } catch (error) {
      return toFavoritesError(error);
    }
  }

  @ApiOperation({
    summary: "Thêm yêu thích",
    description: "`productId`: uuid, legacy_key hoặc slug.",
  })
  @ApiBody({
    schema: {
      type: "object",
      required: ["productId"],
      properties: { productId: { type: "string", example: "tpl-01" } },
    },
  })
  @Post()
  async add(@AuthUser() user: JwtPayload, @Body() body: unknown) {
    try {
      const json = asPlainObject(body);
      const productId =
        typeof json.productId === "string" ? json.productId.trim() : "";
      if (!productId) {
        throw apiError("Thiếu productId.", HttpStatus.BAD_REQUEST);
      }
      await this.favorites.add(user.sub, productId);
      const data = await this.favorites.list(user.sub);
      return { ok: true, data };
    } catch (error) {
      return toFavoritesError(error);
    }
  }

  @ApiOperation({
    summary: "Bỏ yêu thích",
    description:
      "`productId` trong path: uuid, legacy_key hoặc slug (encode URI nếu cần).",
  })
  @ApiParam({ name: "productId", example: "tpl-01" })
  @Delete(":productId")
  async remove(
    @AuthUser() user: JwtPayload,
    @Param("productId") productIdRaw: string,
  ) {
    try {
      const productId = decodeURIComponent(productIdRaw ?? "").trim();
      if (!productId) {
        throw apiError("Thiếu productId.", HttpStatus.BAD_REQUEST);
      }
      const removed = await this.favorites.remove(user.sub, productId);
      if (!removed) {
        throw apiError(
          "Sản phẩm chưa có trong yêu thích.",
          HttpStatus.NOT_FOUND,
        );
      }
      const data = await this.favorites.list(user.sub);
      return { ok: true, data };
    } catch (error) {
      return toFavoritesError(error);
    }
  }
}
