import { auth } from "./utils/auth";
import { NextResponse } from "next/server";

const adminRoutes = [
  "/admin/dashboard",
  "/admin/createTask",
  "/admin/groups",
  "/admin/createUser",
]

export default auth((req) => {
  const isAuthenticated = !!req.auth; // Usuario autenticado
  const isLoginPage = req.nextUrl.pathname === "/auth/login"; // Página de login

  // Si el usuario no está autenticado y no está en /auth/login, redirigir a login
  if (!isAuthenticated && !isLoginPage) {
    const loginUrl = new URL("/auth/login", req.nextUrl.origin);
    return NextResponse.redirect(loginUrl);
  }

  // Si el usuario está autenticado y está en /auth/login, redirigir al dashboard correspondiente
  if (isAuthenticated && (isLoginPage || req.nextUrl.pathname === "/")) {
    const role = req.auth?.user.role;
    const dashboardUrl =
      role === "admin"
        ? new URL("/admin/dashboard", req.nextUrl.origin)
        : new URL("/user/dashboard", req.nextUrl.origin);
    return NextResponse.redirect(dashboardUrl);
  }

  // Redirigir según el rol y la ruta
  const role = req.auth?.user.role;
  const isAdminRoute = adminRoutes.some(route => req.nextUrl.pathname.includes(route));
  const isUserRoute = req.nextUrl.pathname === "/user/dashboard";

  if (role === "admin" && (isUserRoute || !isAdminRoute)) {
    // Admin no puede acceder a rutas de usuario
    const adminDashboard = new URL("/admin/dashboard", req.nextUrl.origin);
    return NextResponse.redirect(adminDashboard);
  }

  if (role === "user" && (isAdminRoute || !isUserRoute)) {
    // Usuario no puede acceder a rutas de admin
    const userDashboard = new URL("/user/dashboard", req.nextUrl.origin);
    return NextResponse.redirect(userDashboard);
  }

  // Continuar con la solicitud normal
  return NextResponse.next();
});

export const config = {
  matcher: [
    "/",
    "/auth/",
    "/auth/login",   // Página de login
    "/admin/:path*", // Rutas protegidas para administradores
    "/user/:path*",  // Rutas protegidas para usuarios
  ],
};