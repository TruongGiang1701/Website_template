import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import type { JwtPayload } from "@/modules/auth/jwt-payload";

/**
 * Decorator lấy payload user từ Request (được Passport/JwtStrategy gán vào req.user).
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): JwtPayload | null => {
    const request = ctx.switchToHttp().getRequest<{ user?: JwtPayload }>();
    return request.user || null;
  },
);
