import { NextRequest, NextResponse } from "next/server";
// import jwt from "jsonwebtoken";
import { jwtVerify } from "jose";

// const SECRET_KEY = process.env.JWT_SECRET_KEY || "your-secret-key";
const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET_KEY || "your-secret-key");

export async function authMiddleware(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value;
  console.log("Token:", token);
  if (!token) {
    return NextResponse.redirect(new URL("/", req.url));
  }
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    (req as any).user = payload;
    return NextResponse.next();
  } catch (err) {
    console.error("JWT verification error:", err);
    return NextResponse.redirect(new URL("/", req.url));
  }
}
