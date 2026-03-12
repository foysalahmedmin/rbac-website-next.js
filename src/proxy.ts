import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // Extract token from request headers or cookies if stored there.
  // In a real app we might verify the JWT. Here we rely on AuthProvider
  // and ProtectedRoute on the client side for actual permission enforcement,
  // but we can do a preliminary check.

  // For this assignment, we mostly rely on client-side routing & ProtectedRoute,
  // but this middleware can redirect unauthenticated users globally.
  if (
    request.nextUrl.pathname.startsWith("/dashboard") ||
    request.nextUrl.pathname.startsWith("/users") ||
    request.nextUrl.pathname.startsWith("/roles") ||
    request.nextUrl.pathname.startsWith("/permissions") ||
    request.nextUrl.pathname.startsWith("/audit-logs")
  ) {
    // Just a placeholder, as we use localStorage for the token currently (client-side)
    // and middleware runs on the server where localStorage isn't available.
    // So we will just pass through and let the client-side ProtectedRoute handle it.
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
