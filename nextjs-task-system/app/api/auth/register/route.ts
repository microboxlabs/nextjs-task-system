import { NextResponse } from "next/server";
import db from "@/Utils/db";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, firstName, lastName } = body;

    // Check if user already exists
    const existingUser = db
      .prepare("SELECT id FROM users WHERE email = ?")
      .get(email);

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 },
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert new user
    db.prepare(
      "INSERT INTO users (email, password, first_name, last_name, role) VALUES (?, ?, ?, ?, ?)",
    ).run(email, hashedPassword, firstName, lastName, "user");

    return NextResponse.json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Error during registration" },
      { status: 500 },
    );
  }
}
