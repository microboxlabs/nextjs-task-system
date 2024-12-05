import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get("authToken");
  const userRole = request.cookies.get("userRole");

  // Rutas públicas que no requieren autenticación
  const publicPaths = ["/login", "/api/auth/login"];
  const isPublicPath = publicPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path),
  );

  // Si no hay token y la ruta no es pública, redirigir al login
  if (!authToken && !isPublicPath) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Si hay token y es la página de login, redirigir según el rol
  if (authToken && request.nextUrl.pathname === "/login") {
    if (userRole?.value === "admin") {
      return NextResponse.redirect(new URL("/admin", request.url));
    } else {
      return NextResponse.redirect(new URL("/user", request.url));
    }
  }

  // Protección de rutas por rol
  if (authToken) {
    // Proteger ruta /admin
    if (
      request.nextUrl.pathname.startsWith("/admin") &&
      userRole?.value !== "admin"
    ) {
      return NextResponse.redirect(new URL("/user", request.url));
    }

    // Proteger ruta /user
    if (
      request.nextUrl.pathname.startsWith("/user") &&
      userRole?.value !== "user"
    ) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public).*)"],
};
