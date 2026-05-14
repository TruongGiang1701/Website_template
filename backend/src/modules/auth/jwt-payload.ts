export type JwtPayload = {
  sub: string;
  email: string;
  role: "admin" | "staff" | "customer";
  /** Phân biệt access vs refresh; bắt buộc với token phát hành mới. */
  token_use?: "access" | "refresh";
};
