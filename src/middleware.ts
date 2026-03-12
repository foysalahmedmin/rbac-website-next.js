import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const refreshToken = request.cookies.get("refresh_token");
  const { pathname } = request.nextUrl;

  // Public routes that should not be accessible if logged in
  const authRoutes = ["/signin", "/signup"];

  // Protected dashboard routes
  const isDashboardRoute =
    pathname === "/" ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/users") ||
    pathname.startsWith("/roles") ||
    pathname.startsWith("/permissions") ||
    pathname.startsWith("/audit-logs") ||
    pathname.startsWith("/leads") ||
    pathname.startsWith("/tasks") ||
    pathname.startsWith("/reports") ||
    pathname.startsWith("/customer-portal") ||
    pathname.startsWith("/settings");

  if (isDashboardRoute) {
    if (!refreshToken) {
      return NextResponse.redirect(new URL("/signin", request.url));
    }

    // Redirect / to /dashboard
    if (pathname === "/") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  if (authRoutes.includes(pathname)) {
    if (refreshToken) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/users/:path*",
    "/roles/:path*",
    "/permissions/:path*",
    "/audit-logs/:path*",
    "/leads/:path*",
    "/tasks/:path*",
    "/reports/:path*",
    "/customer-portal/:path*",
    "/settings/:path*",
    "/signin",
    "/signup",
  ],
};
