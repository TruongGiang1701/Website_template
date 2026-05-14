import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import type { ExecutionContext } from "@nestjs/common";

/**
 * Like JwtAuthGuard, but allows anonymous requests.
 * If `Authorization: Bearer ...` is present, it will validate and populate `req.user`.
 * If missing, it just continues without a user.
 */
@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard("jwt") {
  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<{
      headers?: Record<string, unknown>;
    }>();
    const auth = req.headers?.authorization;
    if (typeof auth !== "string" || auth.trim().length === 0) return true;
    return super.canActivate(context);
  }
}

