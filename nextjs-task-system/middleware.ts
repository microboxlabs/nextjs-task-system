import { NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

export function middleware(req) {
    const token = req.cookies.get("auth-token");
    const url = req.nextUrl.clone();

    if (!token) {
        url.pathname = "/login";
        return NextResponse.redirect(url);
    }

    try {
        const decodeToken = jwtDecode(token.value);

        if (url.pathname.startsWith("/dashboard") && decodeToken.role !== "adm") {
            url.pathname = "/unauthorized";
            return NextResponse.redirect(url);
        }

        if (url.pathname === "/my-tasks" && decodeToken.role !== "user") {
            url.pathname = "/unauthorized";
            return NextResponse.redirect(url);
        }
    } catch (err) {
        console.error("Invalid token", err);
        url.pathname = "/login";
        return NextResponse.redirect(url);
    }
}

export const config = {
    matcher: ["/dashboard/:path*", "/my-tasks"], // Rutas protegidas
};
