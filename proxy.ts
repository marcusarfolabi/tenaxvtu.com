import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  const role = request.cookies.get("user_role")?.value;
  const { pathname } = request.nextUrl;

  // 1. GLOBAL GUEST CHECK
  if (
    !token &&
    (pathname.startsWith("/account") || pathname.startsWith("/dashboard"))
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 2. AUTHENTICATED USERS LOGIC
  if (token) {
    if (pathname === "/login" || pathname === "/register") {
      return NextResponse.redirect(new URL("/account", request.url));
    }

    // --- DASHBOARD RESTRICTIONS ---
    if (pathname.startsWith("/dashboard") && role !== "agent") {
      return NextResponse.redirect(new URL("/account", request.url));
    }

    // --- ROLE VALIDATION ---
    const isAuthorizedRole = role === "customer" || role === "agent";
    if (!isAuthorizedRole) {
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("auth_token");
      return response;
    }
  }

  return NextResponse.next();
}

// CRITICAL: Update the matcher to include /dashboard
export const config = {
  matcher: ["/account/:path*", "/dashboard/:path*", "/login", "/register"],
};
