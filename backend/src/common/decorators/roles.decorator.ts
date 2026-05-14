import { SetMetadata } from "@nestjs/common";
import type { JwtPayload } from "@/modules/auth/jwt-payload";

export const ROLES_KEY = "roles";

/** Gắn lên handler/class; dùng kèm `RolesGuard` sau `JwtAuthGuard`. */
export const Roles = (...roles: JwtPayload["role"][]) =>
  SetMetadata(ROLES_KEY, roles);
