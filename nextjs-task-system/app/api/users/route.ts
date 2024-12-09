import { NextResponse } from "next/server";
import db from "@/Utils/db";

export async function GET() {
  try {
    const users = db
      .prepare(
        `SELECT id, first_name, last_name, email, role, created_at, updated_at FROM users ORDER BY first_name, last_name`,
      )
      .all();
    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Error al obtener usuarios" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  const { first_name, last_name, email, password, role } = await req.json();

  if (!first_name || !last_name || !email || !password || !role) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  try {
    const statement = db.prepare(
      "INSERT INTO users (first_name, last_name, email, password, role) VALUES (?, ?, ?, ?, ?)",
    );
    const result = statement.run(first_name, last_name, email, password, role);

    return NextResponse.json(
      { id: result.lastInsertRowid, message: "User created successfully" },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
