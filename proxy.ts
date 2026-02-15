import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  const role = request.cookies.get("user_role")?.value;
  const { pathname } = request.nextUrl;

  if (!token && pathname.startsWith("/account")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token) {
    if (pathname === "/login" || pathname === "/register") {
      return NextResponse.redirect(new URL("/account", request.url));
    }

    // BLOCK CUSTOMERS FROM THE USERS PAGE
    if (pathname.startsWith("/account/users") && role === "customer") {
      return NextResponse.redirect(new URL("/account", request.url));
    }
    
    const isAuthorizedRole = role === "customer" || role === "agent";
    if (pathname.startsWith("/account") && !isAuthorizedRole) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  

  return NextResponse.next();
}

export const config = {
  matcher: ["/account/:path*", "/login", "/register"],
};
