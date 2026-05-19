import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { apiError, asPlainObject } from "@/common/http-error";
import { Roles } from "@/common/decorators/roles.decorator";
import { RolesGuard } from "@/common/guards/roles.guard";
import { JwtAuthGuard } from "@/modules/auth/jwt-auth.guard";
import { ProductMutationError } from "./products.mutations";
import type { ListProductsFilter } from "./products.repository";
import { ProductsService } from "./products.service";

const DEFAULT_LIMIT = 24;
const MAX_LIMIT = 50;

type ProductsQuery = {
  q?: string;
  group?: string;
  groups?: string;
  ids?: string;
  price?: string;
  featured?: string;
  all_status?: string;
  include_deleted?: string;
  page?: string;
  limit?: string;
};

function truthyParam(value: string | undefined) {
  const v = value?.toLowerCase()?.trim();
  return v === "true" || v === "1" || v === "yes";
}

function parseCsv(raw: string | undefined) {
  return raw
    ? raw
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : undefined;
}

function parsePage(raw: string | undefined) {
  const n = raw ? Number.parseInt(raw, 10) : 1;
  return Number.isFinite(n) && n >= 1 ? n : 1;
}

function parseLimit(raw: string | undefined) {
  const n = raw ? Number.parseInt(raw, 10) : DEFAULT_LIMIT;
  const safe = Number.isFinite(n) && n >= 1 ? n : DEFAULT_LIMIT;
  return Math.min(safe, MAX_LIMIT);
}

function parsePriceBucket(
  raw: string | undefined,
): ListProductsFilter["price_bucket"] {
  if (raw === "under_10m" || raw === "10m_15m" || raw === "promo") return raw;
  return undefined;
}

function parseFeatured(raw: string | undefined): boolean | undefined {
  if (raw === "true") return true;
  if (raw === "false") return false;
  return undefined;
}

function toProductError(error: unknown): never {
  if (error instanceof HttpException) throw error;
  if (error instanceof ProductMutationError) {
    throw apiError(error.message, error.statusCode);
  }
  const message = error instanceof Error ? error.message : "Unknown error";
  const status = message.includes("JSON")
    ? HttpStatus.BAD_REQUEST
    : HttpStatus.INTERNAL_SERVER_ERROR;
  throw apiError(message, status);
}

@ApiTags("Products")
@Controller("products")
export class ProductsController {
  constructor(
    @Inject(ProductsService) private readonly products: ProductsService,
  ) {}

  @ApiOperation({ summary: "Thống kê catalog cho UI filter/sidebar" })
  @ApiOkResponse({
    description: "Trả tổng số mẫu, số theo nhóm và theo loại website/landing.",
  })
  @Get("meta")
  async meta() {
    try {
      const data = await this.products.meta();
      return { ok: true, data };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      throw apiError(message);
    }
  }

  @ApiOperation({
    summary: "Danh sách sản phẩm public có phân trang và filter",
  })
  @ApiQuery({ name: "q", required: false, description: "Tìm theo tiêu đề." })
  @ApiQuery({ name: "group", required: false, description: "Lọc theo 1 nhóm." })
  @ApiQuery({
    name: "groups",
    required: false,
    description: "Lọc theo nhiều nhóm (CSV), ví dụ: Doanh nghiệp,Công nghệ",
  })
  @ApiQuery({
    name: "ids",
    required: false,
    description:
      "CSV legacy_key để resolve giỏ hàng/yêu thích, ví dụ: tpl-01,tpl-02",
  })
  @ApiQuery({
    name: "price",
    required: false,
    description: "under_10m | 10m_15m | promo",
  })
  @ApiQuery({ name: "featured", required: false, description: "true | false" })
  @ApiQuery({ name: "page", required: false, example: "1" })
  @ApiQuery({ name: "limit", required: false, example: "24" })
  @ApiOkResponse({
    description: "Trả data + meta {page, limit, total, pageCount, filters}.",
  })
  @Get()
  async list(@Query() query: ProductsQuery) {
    try {
      const groups = parseCsv(query.groups);
      const legacyKeys = parseCsv(query.ids);
      const price_bucket = parsePriceBucket(query.price);
      const featured = parseFeatured(query.featured);
      const all_status = truthyParam(query.all_status);
      const include_deleted = truthyParam(query.include_deleted);

      const page = parsePage(query.page);
      const limit = parseLimit(query.limit);
      const offset = (page - 1) * limit;
      const filters: ListProductsFilter = {
        q: query.q,
        group: query.group,
        groups,
        ...(legacyKeys && legacyKeys.length > 0
          ? { legacy_keys: legacyKeys }
          : {}),
        price_bucket,
        featured,
        all_status,
        include_deleted,
      };

      const [total, items] = await Promise.all([
        this.products.count(filters),
        this.products.list(filters, limit, offset),
      ]);
      const pageCount = Math.max(1, Math.ceil(total / limit));

      return {
        ok: true,
        data: items,
        meta: {
          page,
          limit,
          total,
          pageCount,
          filters: {
            ...(query.q?.trim() ? { q: query.q.trim() } : {}),
            ...(query.group?.trim() ? { group: query.group.trim() } : {}),
            ...(groups && groups.length > 0 ? { groups } : {}),
            ...(legacyKeys && legacyKeys.length > 0 ? { ids: legacyKeys } : {}),
            ...(price_bucket ? { price: price_bucket } : {}),
            ...(featured !== undefined ? { featured } : {}),
            ...(all_status ? { all_status: true } : {}),
            ...(include_deleted ? { include_deleted: true } : {}),
          },
        },
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      throw apiError(message);
    }
  }

  @ApiOperation({ summary: "Tạo sản phẩm (chỉ admin)" })
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: "Thiếu hoặc sai Bearer access token." })
  @ApiForbiddenResponse({ description: "Token hợp lệ nhưng không phải admin." })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  @ApiBody({
    schema: {
      type: "object",
      required: ["title", "group_name", "price_vnd"],
      properties: {
        title: { type: "string", example: "Website E-commerce Nội thất" },
        slug: { type: "string", example: "website-ecommerce-noi-that" },
        group_name: { type: "string", example: "Doanh nghiệp" },
        price_vnd: { type: "number", example: 12000000 },
        featured: { type: "boolean", example: true },
      },
    },
  })
  @Post()
  async create(@Body() body: unknown) {
    try {
      const data = await this.products.create(asPlainObject(body));
      return { ok: true, data };
    } catch (error) {
      return toProductError(error);
    }
  }

  @ApiOperation({ summary: "Danh sách sản phẩm liên quan theo nhóm" })
  @ApiParam({ name: "slug", example: "website-ecommerce-noi-that" })
  @ApiQuery({ name: "limit", required: false, example: "12" })
  @Get(":slug/related")
  async related(
    @Param("slug") slug: string,
    @Query("limit") limitRaw?: string,
  ) {
    try {
      const decoded = decodeURIComponent(slug ?? "").trim();
      if (!decoded) throw apiError("Missing slug", HttpStatus.BAD_REQUEST);
      const detail = await this.products.detail(decoded);
      if (!detail) throw apiError("Not found", HttpStatus.NOT_FOUND);
      let limit = limitRaw ? Number.parseInt(limitRaw, 10) : 12;
      if (!Number.isFinite(limit) || limit < 1) limit = 12;
      limit = Math.min(50, limit);
      const data = await this.products.related(
        detail.slug,
        detail.group,
        limit,
      );
      return { ok: true, data };
    } catch (error) {
      if (error instanceof ProductMutationError) return toProductError(error);
      throw error;
    }
  }

  @ApiOperation({ summary: "Chi tiết sản phẩm theo slug" })
  @ApiParam({ name: "slug", example: "website-ecommerce-noi-that" })
  @Get(":slug")
  async detail(@Param("slug") slug: string) {
    try {
      const decoded = decodeURIComponent(slug ?? "").trim();
      if (!decoded) throw apiError("Missing slug", HttpStatus.BAD_REQUEST);
      const data = await this.products.detail(decoded);
      if (!data) throw apiError("Not found", HttpStatus.NOT_FOUND);
      return { ok: true, data };
    } catch (error) {
      if (error instanceof ProductMutationError) return toProductError(error);
      throw error;
    }
  }

  @ApiOperation({ summary: "Cập nhật sản phẩm theo slug (chỉ admin)" })
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: "Thiếu hoặc sai Bearer access token." })
  @ApiForbiddenResponse({ description: "Token hợp lệ nhưng không phải admin." })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  @ApiParam({ name: "slug", example: "website-ecommerce-noi-that" })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        title: { type: "string" },
        group_name: { type: "string" },
        price_vnd: { type: "number" },
        featured: { type: "boolean" },
        status: { type: "string", enum: ["draft", "active", "archived"] },
      },
    },
  })
  @Patch(":slug")
  async update(@Param("slug") slug: string, @Body() body: unknown) {
    try {
      const decoded = decodeURIComponent(slug ?? "").trim();
      if (!decoded) throw apiError("Missing slug", HttpStatus.BAD_REQUEST);
      const data = await this.products.update(decoded, asPlainObject(body));
      return { ok: true, data };
    } catch (error) {
      return toProductError(error);
    }
  }

  @ApiOperation({ summary: "Xóa mềm sản phẩm theo slug (chỉ admin)" })
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: "Thiếu hoặc sai Bearer access token." })
  @ApiForbiddenResponse({ description: "Token hợp lệ nhưng không phải admin." })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  @ApiParam({ name: "slug", example: "website-ecommerce-noi-that" })
  @Delete(":slug")
  async remove(@Param("slug") slug: string) {
    try {
      const decoded = decodeURIComponent(slug ?? "").trim();
      if (!decoded) throw apiError("Missing slug", HttpStatus.BAD_REQUEST);
      const data = await this.products.softDelete(decoded);
      return { ok: true, data };
    } catch (error) {
      return toProductError(error);
    }
  }
}
