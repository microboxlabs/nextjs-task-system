import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const protectedRoutes = ["/home"];
export async function middleware(req: NextRequest) {
  const cookieStore = cookies();
  const { pathname } = req.nextUrl;

  const token = cookieStore.get("tokenLogin")?.value;

  if (token && pathname === "/") {
    try {
      return NextResponse.redirect(new URL("/home", req.url));
    } catch (error) {
      console.error("Token inválido o expirado:", error);

      const response = NextResponse.next();
      response.cookies.delete("tokenLogin");
      return response;
    }
  }

  if (!token && protectedRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/home"],
};
