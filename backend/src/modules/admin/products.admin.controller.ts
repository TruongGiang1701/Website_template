import {
  Controller,
  Get,
  Post,
  Body,
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
import * as ProductsRepository from "@/modules/products/products.repository";

@ApiTags("Admin Products")
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: "Thiếu hoặc sai Bearer access token." })
@ApiForbiddenResponse({ description: "Token hợp lệ nhưng không phải admin." })
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("admin")
@Controller("admin/products")
export class ProductsAdminController {
  @ApiOperation({ summary: "Danh sách toàn bộ sản phẩm (admin)" })
  @ApiQuery({ name: "page", required: false, example: 1 })
  @ApiQuery({ name: "pageSize", required: false, example: 20 })
  @ApiQuery({ name: "q", required: false, description: "Tìm kiếm theo tiêu đề" })
  @ApiOkResponse({ description: "Trả về toàn bộ sản phẩm (gồm draft, archived, soft deleted)." })
  @Get()
  async list(
    @Query("page") pageStr?: string,
    @Query("pageSize") pageSizeStr?: string,
    @Query("q") q?: string,
  ) {
    try {
      const page = pageStr ? Number.parseInt(pageStr, 10) : 1;
      const pageSize = pageSizeStr ? Number.parseInt(pageSizeStr, 10) : 20;
      
      const safePage = Math.max(1, page);
      const safePageSize = Math.min(100, Math.max(1, pageSize));
      const offset = (safePage - 1) * safePageSize;

      const filters = {
        q: q || undefined,
        all_status: true,
        include_deleted: true,
      };

      const [total, items] = await Promise.all([
        ProductsRepository.countProducts(filters),
        ProductsRepository.listProducts(filters, safePageSize, offset),
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

  @ApiOperation({ summary: "Tạo sản phẩm mới (admin)" })
  @Post()
  async create(@Body() body: any) {
    try {
      const result = await ProductsRepository.createProduct(body);
      return { ok: true, data: result };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      throw apiError(message);
    }
  }
}

