import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

interface User {
  role: string;
}

function getUserFromCookies(request: NextRequest): User | null {
  const token = request.cookies.get("auth-storage")?.value;
  if (!token) return null;

  try {
    return JSON.parse(token).state.user || null;
  } catch {
    return null; // In case of invalid JSON
  }
}

export function middleware(request: NextRequest) {
  const user = getUserFromCookies(request);
  const { pathname } = request.nextUrl;

  // Unauthenticated users are only allowed on /login
  if (!user && pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Authenticated users are redirected from / or /login to /dashboard
  if (user && (pathname === "/" || pathname === "/login")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Restrict access to /tasks/create to admins only
  if (pathname === "/tasks/create" && user?.role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Allow access to all other cases
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard", "/tasks/create", "/tasks/:path*", "/login"],
};
