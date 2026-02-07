import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware for Next.js App Router
 * 
 * Note: Since we use localStorage for JWT storage (client-side only),
 * this middleware cannot check authentication status.
 * 
 * Client-side auth protection is handled in:
 * - Login/Register pages: Auto-redirect if already authenticated
 * - Dashboard pages: useEffect hook checks auth and redirects to /login
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow all requests to pass through
  // Auth checks are done client-side via useEffect hooks
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
