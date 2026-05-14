import { Inject, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { compare, hash } from "bcryptjs";
import { isEmail } from "class-validator";
import { apiError } from "@/common/http-error";
import { getJwtAccessExpiresIn, getJwtRefreshExpiresIn } from "@/lib/env";
import { UsersMutationError } from "@/modules/users/users.errors";
import {
  createUserWithSettings,
  getUserAuthByEmail,
} from "@/modules/users/users.repository";
import { UsersService } from "@/modules/users/users.service";
import type { JwtPayload } from "./jwt-payload";

@Injectable()
export class AuthService {
  constructor(
    @Inject(JwtService) private readonly jwt: JwtService,
    @Inject(UsersService) private readonly users: UsersService,
  ) {}

  private signAccess(claims: Pick<JwtPayload, "sub" | "email" | "role">) {
    const payload: JwtPayload = { ...claims, token_use: "access" };
    return this.jwt.sign(payload, {
      expiresIn: getJwtAccessExpiresIn() as never,
    });
  }

  private signRefresh(claims: Pick<JwtPayload, "sub" | "email" | "role">) {
    const payload: JwtPayload = { ...claims, token_use: "refresh" };
    return this.jwt.sign(payload, {
      expiresIn: getJwtRefreshExpiresIn() as never,
    });
  }

  private buildAuthPayload(claims: Pick<JwtPayload, "sub" | "email" | "role">) {
    const accessToken = this.signAccess(claims);
    const refreshToken = this.signRefresh(claims);
    return {
      accessToken,
      refreshToken,
      // Backward compatible field for old clients still reading `token`.
      token: accessToken,
      tokenType: "Bearer" as const,
      accessExpiresIn: getJwtAccessExpiresIn(),
      refreshExpiresIn: getJwtRefreshExpiresIn(),
    };
  }

  async register(raw: Record<string, unknown>) {
    const name = typeof raw.name === "string" ? raw.name.trim() : "";
    const email =
      typeof raw.email === "string" ? raw.email.trim().toLowerCase() : "";
    const password = typeof raw.password === "string" ? raw.password : "";

    if (!name || !email || !password) {
      throw apiError("Thiếu name, email hoặc password.", 400);
    }
    if (!isEmail(email)) {
      throw apiError("Email không đúng định dạng.", 400);
    }
    if (password.length < 8) {
      throw apiError("Password tối thiểu 8 ký tự.", 400);
    }

    let user;
    try {
      const password_hash = await hash(password, 12);
      user = await createUserWithSettings({ name, email, password_hash });
    } catch (error) {
      if (error instanceof UsersMutationError) {
        throw apiError(error.message, error.statusCode);
      }
      throw error;
    }

    const tokens = this.buildAuthPayload({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
    return { ...tokens, user };
  }

  async login(raw: Record<string, unknown>) {
    const email =
      typeof raw.email === "string" ? raw.email.trim().toLowerCase() : "";
    const password = typeof raw.password === "string" ? raw.password : "";
    if (!email || !password) {
      throw apiError("Thiếu email hoặc password.", 400);
    }
    if (!isEmail(email)) {
      throw apiError("Email không đúng định dạng.", 400);
    }

    const auth = await getUserAuthByEmail(email);
    if (!auth) throw apiError("Sai email hoặc password.", 401);
    if (auth.is_disabled) throw apiError("Tài khoản đã bị khóa.", 403);

    const ok = await compare(password, auth.password_hash);
    if (!ok) throw apiError("Sai email hoặc password.", 401);

    const user = await this.users.getProfile(auth.id);
    if (!user) throw apiError("Không tìm thấy hồ sơ người dùng.", 404);
    const tokens = this.buildAuthPayload({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
    return { ...tokens, user };
  }

  /**
   * Đăng nhập console admin: cùng luồng DB như `login`, nhưng chỉ chấp nhận `users.role = 'admin'`.
   * Khách / staff / customer dù đúng mật khẩu vẫn bị từ chối (403) để không lộ endpoint chung.
   */
  async adminLogin(raw: Record<string, unknown>) {
    const email =
      typeof raw.email === "string" ? raw.email.trim().toLowerCase() : "";
    const password = typeof raw.password === "string" ? raw.password : "";
    if (!email || !password) {
      throw apiError("Thiếu email hoặc password.", 400);
    }
    if (!isEmail(email)) {
      throw apiError("Email không đúng định dạng.", 400);
    }

    const auth = await getUserAuthByEmail(email);
    if (!auth) throw apiError("Sai email hoặc password.", 401);
    if (auth.role !== "admin") {
      throw apiError("Sai email hoặc password.", 401);
    }
    if (auth.is_disabled) throw apiError("Tài khoản đã bị khóa.", 403);

    const ok = await compare(password, auth.password_hash);
    if (!ok) throw apiError("Sai email hoặc password.", 401);

    const user = await this.users.getProfile(auth.id);
    if (!user) throw apiError("Không tìm thấy hồ sơ người dùng.", 404);
    if (user.role !== "admin") {
      throw apiError("Chỉ tài khoản admin mới được vào trang quản trị.", 403);
    }

    const tokens = this.buildAuthPayload({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
    return { ...tokens, user };
  }

  async me(userId: string) {
    const user = await this.users.getProfile(userId);
    if (!user) throw apiError("Không tìm thấy người dùng.", 404);
    return user;
  }

  /**
   * Đổi refresh token → cặp access + refresh mới (rotation).
   * Chỉ chấp nhận JWT có `token_use: "refresh"` (token cũ không có claim này cần đăng nhập lại).
   */
  async refresh(raw: Record<string, unknown>) {
    const refreshToken =
      typeof raw.refreshToken === "string" ? raw.refreshToken.trim() : "";
    if (!refreshToken) {
      throw apiError("Thiếu refreshToken.", 400);
    }

    let decoded: JwtPayload;
    try {
      decoded = this.jwt.verify<JwtPayload>(refreshToken);
    } catch {
      throw apiError("Refresh token không hợp lệ hoặc đã hết hạn.", 401);
    }

    if (decoded.token_use !== "refresh") {
      throw apiError("Không phải refresh token hợp lệ.", 401);
    }

    const user = await this.users.getProfile(decoded.sub);
    if (!user) throw apiError("Không tìm thấy người dùng.", 404);
    if (user.is_disabled) throw apiError("Tài khoản đã bị khóa.", 403);
    if (
      user.email.trim().toLowerCase() !== decoded.email.trim().toLowerCase()
    ) {
      throw apiError("Refresh token không khớp tài khoản.", 401);
    }

    const tokens = this.buildAuthPayload({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
    return { ...tokens, user };
  }
}
