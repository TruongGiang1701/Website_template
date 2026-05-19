import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  HttpStatus,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { diskStorage } from "multer";
import { extname } from "path";
import { JwtAuthGuard } from "@/modules/auth/jwt-auth.guard";
import { RolesGuard } from "@/common/guards/roles.guard";
import { Roles } from "@/common/decorators/roles.decorator";
import { apiError } from "@/common/http-error";
import { ensureUploadsDir, publicUploadUrl, UPLOADS_DIR } from "@/lib/uploads";

ensureUploadsDir();

@ApiTags("Admin Media")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("admin")
@Controller("admin/upload")
export class MediaAdminController {
  @Post()
  @ApiOperation({ summary: "Upload ảnh (multipart/form-data, field `file`)" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        file: { type: "string", format: "binary" },
      },
    },
  })
  @ApiOkResponse({
    description: "URL path để gán vào product_images.url",
    schema: {
      type: "object",
      properties: {
        ok: { type: "boolean", example: true },
        data: {
          type: "object",
          properties: {
            url: { type: "string", example: "/public/uploads/img-123.jpg" },
          },
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: UPLOADS_DIR,
        filename: (_req, file, cb) => {
          const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          const ext = extname(file.originalname).toLowerCase() || ".jpg";
          cb(null, `img-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (_req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
          cb(new Error("Chỉ chấp nhận file ảnh (jpg, png, gif, webp)."), false);
          return;
        }
        cb(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw apiError("Không có file nào được tải lên.", HttpStatus.BAD_REQUEST);
    }
    const url = publicUploadUrl(file.filename);
    return { ok: true, data: { url } };
  }
}
