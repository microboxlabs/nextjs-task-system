import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";
import bcrypt from "bcryptjs";
import { authorizeUser } from "@/utils/authUtils";

export async function GET(req: NextRequest) {
  try {
    const { status, response } = await authorizeUser('admin');

    if (status !== 200) {
      return response;
    }

    const users = await prisma.user.findMany();

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    return NextResponse.json({ error: "Could not retrieve users" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { status, response } = await authorizeUser('admin');

    if (status !== 200) {
      return response;
    }

    const body = await req.json();
    const { name, email, password, role } = body;

    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const encryptesPassword = await bcrypt.hash(password, 10)
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: encryptesPassword,
        role
      }
    })

    return NextResponse.json({ message: "User created successfully", newUser }, { status: 201 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Could not insert Group" }, { status: 500 });
  } finally {
    await prisma.$disconnect()
  }
}