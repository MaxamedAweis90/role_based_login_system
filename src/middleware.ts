import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJWT } from './lib/jwt-edge';

// Map database roles to their designated dashboards
function getDashboardPath(role: string): string {
  switch (role) {
    case 'Admin':
      return '/admin';
    case 'Lecturer':
      return '/lecturer';
    case 'Student':
      return '/student';
    default:
      return '/login';
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get token from HTTP-only cookie
  const token = request.cookies.get('auth_token')?.value;

  // Verify JWT session
  let decoded = null;
  if (token) {
    decoded = await verifyJWT(token);
  }

  // Defined page boundaries
  const isLoginPage = pathname === '/login';
  const isAdminRoute = pathname.startsWith('/admin');
  const isLecturerRoute = pathname.startsWith('/lecturer');
  const isStudentRoute = pathname.startsWith('/student');
  const isRootRoute = pathname === '/';

  const isProtectedRoute = isAdminRoute || isLecturerRoute || isStudentRoute;

  // 1. UNAUTHENTICATED USERS:
  if (!decoded) {
    if (isProtectedRoute || isRootRoute) {
      // Redirect to /login with unauthorized query param
      const url = new URL('/login', request.url);
      url.searchParams.set('error', 'unauthorized');
      return NextResponse.redirect(url);
    }
    // Allow access to public pages (e.g. /login itself)
    return NextResponse.next();
  }

  // 2. AUTHENTICATED USERS:
  const userRole = decoded.role;
  const userDashboard = getDashboardPath(userRole);

  // If already logged in, redirect away from /login or root to their dashboard
  if (isLoginPage || isRootRoute) {
    const url = new URL(userDashboard, request.url);
    return NextResponse.redirect(url);
  }

  // Protect Admin pages
  if (isAdminRoute && userRole !== 'Admin') {
    const url = new URL(userDashboard, request.url);
    url.searchParams.set('error', 'access_denied');
    return NextResponse.redirect(url);
  }

  // Protect Lecturer pages
  if (isLecturerRoute && userRole !== 'Lecturer') {
    const url = new URL(userDashboard, request.url);
    url.searchParams.set('error', 'access_denied');
    return NextResponse.redirect(url);
  }

  // Protect Student pages
  if (isStudentRoute && userRole !== 'Student') {
    const url = new URL(userDashboard, request.url);
    url.searchParams.set('error', 'access_denied');
    return NextResponse.redirect(url);
  }

  // Authorizations passed, continue to requested protected page
  return NextResponse.next();
}

// Config to run middleware on all routes except static assets, favicon and api
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
