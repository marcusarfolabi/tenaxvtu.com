import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const role = request.cookies.get('user_role')?.value;
  const { pathname } = request.nextUrl;

  // 1. If no token, redirect all protected routes to login
  if (!token && (pathname.startsWith('/account') || pathname.startsWith('/dashboard') || pathname.startsWith('/admin'))) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 2. Role-Based Redirection Logic
  if (token) {
    // Prevent logged-in users from hitting login/register
    if (pathname === '/login' || pathname === '/register') {
      if (role === 'admin') return NextResponse.redirect(new URL('/admin', request.url));
      if (role === 'agent') return NextResponse.redirect(new URL('/dashboard', request.url));
      return NextResponse.redirect(new URL('/account', request.url)); // default user
    }

    // Protect Admin Routes
    if (pathname.startsWith('/admin') && role !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    // Protect Agent Routes
    if (pathname.startsWith('/dashboard') && role !== 'agent') {
      const fallback = role === 'admin' ? '/admin' : '/account';
      return NextResponse.redirect(new URL(fallback, request.url));
    }

    // Protect User Routes
    if (pathname.startsWith('/account') && role !== 'customer') {
      const fallback = role === 'admin' ? '/admin' : '/dashboard';
      return NextResponse.redirect(new URL(fallback, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/account/:path*', 
    '/dashboard/:path*', 
    '/admin/:path*', 
    '/login', 
    '/register'
  ],
};