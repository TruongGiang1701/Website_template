import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  ADMIN_ACCESS_COOKIE,
  ADMIN_REFRESH_COOKIE,
} from "@/lib/auth-storage";
import { isValidAccessTokenShape, isValidRefreshTokenShape } from "@/lib/jwt-decode";

const LOGIN = "/login";

function isProtectedPath(pathname: string) {
  if (pathname === LOGIN) return false;
  const protectedPrefixes = [
    "/dashboard",
    "/products",
    "/orders",
    "/users",
    "/system-logs",
    "/categories",
  ];
  return protectedPrefixes.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

function readCookieToken(cookieValue: string | undefined) {
  if (!cookieValue) return "";
  try {
    return decodeURIComponent(cookieValue);
  }
  catch {
    return cookieValue;
  }
}

/** Cho vào app nếu access còn hạn HOẶC refresh còn hạn (client sẽ làm mới access). */
function hasAdminGateAccess(accessRaw: string | undefined, refreshRaw: string | undefined) {
  const access = readCookieToken(accessRaw);
  if (access && isValidAccessTokenShape(access)) return true;

  const refresh = readCookieToken(refreshRaw);
  if (refresh && isValidRefreshTokenShape(refresh)) return true;

  return false;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessRaw = request.cookies.get(ADMIN_ACCESS_COOKIE)?.value;
  const refreshRaw = request.cookies.get(ADMIN_REFRESH_COOKIE)?.value;

  if (pathname === LOGIN) {
    if (hasAdminGateAccess(accessRaw, refreshRaw)) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  if (!isProtectedPath(pathname)) {
    return NextResponse.next();
  }

  if (hasAdminGateAccess(accessRaw, refreshRaw)) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = LOGIN;
  url.searchParams.set("from", pathname);
  const res = NextResponse.redirect(url);
  res.cookies.set(ADMIN_ACCESS_COOKIE, "", { path: "/", maxAge: 0 });
  res.cookies.set(ADMIN_REFRESH_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
