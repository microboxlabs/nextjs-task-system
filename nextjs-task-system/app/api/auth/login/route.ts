import { NextResponse } from "next/server";
import db from "@/Utils/db";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  password: string;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    const user = db
      .prepare(
        "SELECT id, email, first_name, last_name, role, password FROM users WHERE email = ?",
      )
      .get(email) as User | undefined;

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    const sessionId = crypto.randomUUID();
    db.prepare(
      "INSERT INTO sessions (id, user_id, created_at) VALUES (?, ?, datetime('now'))",
    ).run(sessionId, user.id);

    const response = NextResponse.json({
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role,
      redirectTo: user.role === "admin" ? "/admin" : "/user/tasks",
    });

    response.cookies.set("sessionId", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Error during login" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const sessionId = (await cookies()).get("sessionId")?.value;

    if (!sessionId) {
      return NextResponse.json({ error: "No session found" }, { status: 401 });
    }

    // Obtener usuario de la sesión
    const session = db
      .prepare(
        `SELECT u.id, u.email, u.first_name, u.last_name, u.role 
         FROM sessions s
         JOIN users u ON s.user_id = u.id
         WHERE s.id = ? AND s.created_at > datetime('now', '-24 hours')`,
      )
      .get(sessionId) as User | undefined;

    if (!session) {
      return NextResponse.json(
        { error: "Invalid or expired session" },
        { status: 401 },
      );
    }

    return NextResponse.json({
      id: session.id,
      email: session.email,
      firstName: session.first_name,
      lastName: session.last_name,
      role: session.role,
    });
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json(
      { error: "Error checking authentication" },
      { status: 500 },
    );
  }
}
