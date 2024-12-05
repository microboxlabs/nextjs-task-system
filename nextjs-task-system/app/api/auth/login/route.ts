import { NextResponse } from "next/server";
import db from "@/Utils/db";
import { User } from "@/tipos/usuarios";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required" },
      { status: 400 },
    );
  }

  try {
    const statement = db.prepare(
      `SELECT id, first_name, last_name, email, password, role FROM users WHERE email = ?`,
    );
    const user: User | undefined = statement.get(email) as User | undefined;

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );
    }

    if (user.password !== password) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );
    }

    const { password: _, ...userWithoutPassword } = user;

    const response = NextResponse.json({
      message: "Login successful",
      user: userWithoutPassword,
    });

    response.cookies.set({
      name: "authToken",
      value: user.id.toString(),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    response.cookies.set({
      name: "userRole",
      value: user.role,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return response;
  } catch (error) {
    console.error("Error during login:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
