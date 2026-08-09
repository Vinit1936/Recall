import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isAuthRoute = nextUrl.pathname.startsWith('/auth');
  const isApiAuth = nextUrl.pathname.startsWith('/api/auth');
  const isApiRoute = nextUrl.pathname.startsWith('/api/');
  const isProtectedRoute =
    nextUrl.pathname.startsWith('/dashboard') ||
    nextUrl.pathname.startsWith('/daily') ||
    nextUrl.pathname.startsWith('/settings');

  // If user is already logged in and visits landing page (/) or auth pages, redirect to dashboard
  if ((nextUrl.pathname === '/' || isAuthRoute) && isLoggedIn) {
    return NextResponse.redirect(new URL('/dashboard', nextUrl));
  }

  // Allow auth pages and /api/auth for unauthenticated users
  if (nextUrl.pathname === '/' || isAuthRoute || isApiAuth) {
    return NextResponse.next();
  }

  // Handle unauthenticated requests
  if (!isLoggedIn) {
    if (isApiRoute) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (isProtectedRoute) {
      const callbackUrl = encodeURIComponent(nextUrl.pathname + nextUrl.search);
      return NextResponse.redirect(
        new URL(`/auth/login?callbackUrl=${callbackUrl}&error=SessionRequired`, nextUrl)
      );
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.svg).*)'],
};
