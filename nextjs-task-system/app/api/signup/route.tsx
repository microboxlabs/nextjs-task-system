import prisma from "@/lib/prisma";
import { SignJWT } from "jose";

import { cookies } from "next/headers";
const secret = new TextEncoder().encode(process.env.JWT_SECRET);
import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    cookies().set("access-token", "buah", { httpOnly: false });
    if (!email || !password) {
      return NextResponse.json({
        message: "Email and password are required",
        status: 400,
      });
    }
    // search for user with the same email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ message: "Invalid credentials", status: 401 });
    }

    //transform and validate the form password in base64

    const isValidPassword = password === user.password;

    if (!isValidPassword) {
      return NextResponse.json({ message: "Invalid credentials", status: 401 });
    }
    //sign a jwt token to validate the login of the user
    const token = await new SignJWT({ email: user.email, rol: user.roleId })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("1h")
      .sign(secret);

    return NextResponse.json({
      message: "Login successful",
      token,
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error", status: 500 });
  }
}
