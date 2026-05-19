import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { apiError } from "@/common/http-error";
import { Roles } from "../../common/decorators/roles.decorator";
import { RolesGuard } from "@/common/guards/roles.guard";
import { JwtAuthGuard } from "@/modules/auth/jwt-auth.guard";
import * as CategoriesRepository from "../categories/categories.repository";
import { CreateCategoryInput, UpdateCategoryInput } from "@/types/categories";

@ApiTags("Admin Categories")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("admin")
@Controller("admin/categories")
export class CategoriesAdminController {
  @ApiOperation({ summary: "Danh sách danh mục (admin)" })
  @ApiOkResponse({ description: "Trả về danh sách danh mục kèm số lượng sản phẩm." })
  @Get()
  async list() {
    try {
      const items = await CategoriesRepository.listCategoriesForAdmin();
      return { ok: true, data: items };
    } catch (error) {
      throw apiError(error instanceof Error ? error.message : "Unknown error");
    }
  }

  @ApiOperation({ summary: "Tạo danh mục mới" })
  @Post()
  async create(@Body() input: CreateCategoryInput) {
    try {
      const item = await CategoriesRepository.createCategory(input);
      return { ok: true, data: item };
    } catch (error) {
      throw apiError(error instanceof Error ? error.message : "Unknown error");
    }
  }

  @ApiOperation({ summary: "Cập nhật danh mục" })
  @Patch(":id")
  async update(@Param("id") id: string, @Body() input: UpdateCategoryInput) {
    try {
      const item = await CategoriesRepository.updateCategory(id, input);
      return { ok: true, data: item };
    } catch (error) {
      throw apiError(error instanceof Error ? error.message : "Unknown error");
    }
  }

  @ApiOperation({ summary: "Xóa danh mục" })
  @Delete(":id")
  async delete(@Param("id") id: string) {
    try {
      await CategoriesRepository.deleteCategory(id);
      return { ok: true };
    } catch (error) {
      throw apiError(error instanceof Error ? error.message : "Unknown error");
    }
  }
}
