import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  const isAuthPage = pathname.startsWith('/auth');
  const isApiAuth = pathname.startsWith('/api/auth');
  const isApiRoute = pathname.startsWith('/api/');

  // Always allow auth pages and NextAuth's own API routes
  if (isAuthPage || isApiAuth) return NextResponse.next();

  if (!isLoggedIn) {
    // Return JSON 401 for API routes, redirect to login for pages
    if (isApiRoute) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico).*)'],
};
