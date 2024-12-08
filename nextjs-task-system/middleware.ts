import { authMiddleware } from './app/lib/authMiddleware';
import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
    console.log('Middleware:', req.nextUrl.pathname);
    const protectedPaths = ['/dashboard', '/profile', '/api/v1/users', '/api/v1/groups', '/api/v1/tasks'];
    const isProtectedRoute = protectedPaths.some(path => req.nextUrl.pathname.startsWith(path));

    if (isProtectedRoute) {
        console.log('Protected route:', req.nextUrl.pathname);
        return authMiddleware(req);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/profile/:path*'], // Configura las rutas protegidas
};
