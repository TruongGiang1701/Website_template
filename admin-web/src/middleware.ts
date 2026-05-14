import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_ACCESS_COOKIE } from "@/lib/auth-storage";
import { decodeJwtPayload } from "@/lib/jwt-decode";

const LOGIN = "/login";

function isProtectedPath(pathname: string) {
  if (pathname === LOGIN) return false;
  const protectedPrefixes = ["/dashboard", "/products", "/orders", "/users", "/system-logs"];
  return protectedPrefixes.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

function readAccessToken(cookieValue: string | undefined) {
  if (!cookieValue) return "";
  try {
    return decodeURIComponent(cookieValue);
  } catch {
    return cookieValue;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === LOGIN) {
    const raw = request.cookies.get(ADMIN_ACCESS_COOKIE)?.value;
    const token = readAccessToken(raw);
    const decoded = token ? decodeJwtPayload(token) : null;
    const expired =
      typeof decoded?.exp === "number" && decoded.exp < Math.floor(Date.now() / 1000);
    if (
      token &&
      decoded?.token_use !== "refresh" &&
      !expired &&
      decoded?.role === "admin"
    ) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  if (!isProtectedPath(pathname)) {
    return NextResponse.next();
  }

  const token = readAccessToken(request.cookies.get(ADMIN_ACCESS_COOKIE)?.value);
  const decoded = token ? decodeJwtPayload(token) : null;
  const role = decoded?.role;
  const isRefresh = decoded?.token_use === "refresh";
  const expired =
    typeof decoded?.exp === "number" && decoded.exp < Math.floor(Date.now() / 1000);

  if (!token || isRefresh || expired || role !== "admin") {
    const url = request.nextUrl.clone();
    url.pathname = LOGIN;
    url.searchParams.set("from", pathname);
    const res = NextResponse.redirect(url);
    res.cookies.set(ADMIN_ACCESS_COOKIE, "", { path: "/", maxAge: 0 });
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
