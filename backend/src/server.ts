import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import type { NestExpressApplication } from "@nestjs/platform-express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import cookieParser from "cookie-parser";
import { AppModule } from "@/app.module";


const port = Number.parseInt(process.env.PORT ?? "4000", 10);

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: true,
    credentials: true,
  });
  app.use(cookieParser());
  app.useBodyParser("json", { limit: "2mb" });
  app.setGlobalPrefix("api");

  const swaggerConfig = new DocumentBuilder()
    .setTitle("VISSTEMP Backend API")
    .setDescription(
      "Swagger docs for backend services. Test API cần token: bấm Authorize (góc phải) và dán accessToken dạng Bearer JWT.",
    )
    .setVersion("1.0")
    .addBearerAuth()
    .build();
  const swaggerDoc = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("api/docs", app, swaggerDoc);

  if (!process.env.DATABASE_URL?.trim()) {
    // eslint-disable-next-line no-console
    console.warn(
      "[backend] DATABASE_URL chưa được cấu hình — các endpoint dùng DB sẽ lỗi 500. " +
        "Sao chép backend/.env.example → backend/.env và điền DATABASE_URL (hoặc thêm vào visstemp/.env.local).",
    );
  }

  await app.listen(port);

  // eslint-disable-next-line no-console
  console.log(`[backend] listening on http://127.0.0.1:${port}`);
}

void bootstrap();
