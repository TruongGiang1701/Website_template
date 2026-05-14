import { createParamDecorator, type ExecutionContext } from "@nestjs/common";
import type { JwtPayload } from "@/modules/auth/jwt-payload";

export type JwtRequest = {
  user: JwtPayload;
};

export const AuthUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<JwtRequest>();
    return req.user;
  },
);
