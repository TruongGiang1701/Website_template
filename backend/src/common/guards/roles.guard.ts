import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "@/common/decorators/roles.decorator";
import type { JwtPayload } from "@/modules/auth/jwt-payload";
import type { JwtRequest } from "@/modules/users/users.types";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<JwtPayload["role"][]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!required || required.length === 0) {
      return true;
    }

    const req = context.switchToHttp().getRequest<JwtRequest>();
    const user = req.user;
    if (!user) {
      throw new ForbiddenException("Thiếu thông tin người dùng.");
    }
    if (!required.includes(user.role)) {
      throw new ForbiddenException("Bạn không có quyền truy cập tài nguyên này.");
    }
    return true;
  }
}
