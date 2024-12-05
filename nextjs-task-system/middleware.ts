import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

// Rutas protegidas donde se requiere autenticación
const protectedRoutes = ["/home", "/tasks"];

export async function middleware(req: NextRequest) {
  const cookieStore = cookies();
  const { pathname } = req.nextUrl;

  const token = cookieStore.get("tokenLogin")?.value;

  if (token && pathname === "/") {
    return NextResponse.redirect(new URL("/home", req.url));
  }

  if (!token && protectedRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/", req.url));
  }


  if (!token) {
    const response = NextResponse.next();
    response.cookies.delete("tokenLogin");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/home", "/tasks"], 
};
