import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const isLoggedIn = request.cookies.has("sessionId");
  const isAuthPage =
    request.nextUrl.pathname === "/login" ||
    request.nextUrl.pathname === "/register";

  // Rutas protegidas que requieren autenticación
  const protectedPaths = ["/user", "/admin"];
  const isProtectedPath = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path),
  );

  // Si el usuario está logueado y trata de acceder a páginas de auth
  if (isLoggedIn && isAuthPage) {
    return NextResponse.redirect(new URL("/user/tasks", request.url));
  }

  // Si el usuario no está logueado y trata de acceder a rutas protegidas
  if (!isLoggedIn && isProtectedPath) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public).*)"],
};
