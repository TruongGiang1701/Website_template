"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app_module_1 = require("./app.module");
const port = Number.parseInt(process.env.PORT ?? "4000", 10);
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: true,
        credentials: true,
    });
    app.use((0, cookie_parser_1.default)());
    app.useBodyParser("json", { limit: "2mb" });
    app.setGlobalPrefix("api");
    const swaggerConfig = new swagger_1.DocumentBuilder()
        .setTitle("VISSTEMP Backend API")
        .setDescription("Swagger docs for backend services. Test API cần token: bấm Authorize (góc phải) và dán accessToken dạng Bearer JWT.")
        .setVersion("1.0")
        .addBearerAuth()
        .build();
    const swaggerDoc = swagger_1.SwaggerModule.createDocument(app, swaggerConfig);
    swagger_1.SwaggerModule.setup("api/docs", app, swaggerDoc);
    if (!process.env.DATABASE_URL?.trim()) {
        // eslint-disable-next-line no-console
        console.warn("[backend] DATABASE_URL chưa được cấu hình — các endpoint dùng DB sẽ lỗi 500. " +
            "Sao chép backend/.env.example → backend/.env và điền DATABASE_URL (hoặc thêm vào visstemp/.env.local).");
    }
    await app.listen(port);
    // eslint-disable-next-line no-console
    console.log(`[backend] listening on http://127.0.0.1:${port}`);
}
void bootstrap();
