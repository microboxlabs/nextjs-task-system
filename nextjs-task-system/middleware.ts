import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    const publicPaths = ['/login', '/']; // Rutas públicas que no requieren autenticación
    const { pathname } = request.nextUrl;

    // Permitir acceso a rutas públicas
    if (publicPaths.includes(pathname)) {
        return NextResponse.next();
    }

    // Obtener el token de las cookies
    const token = request.cookies.get('auth-token')?.value;

    // Si no hay token, redirigir al login
    if (!token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Continuar si hay token
    return NextResponse.next();
}

// Configuración de las rutas que usarán el middleware
export const config = {
    matcher: ['/', '/dashboard/:path*'], // Proteger /dashboard y sus subrutas
};
