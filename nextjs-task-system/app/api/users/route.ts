import { NextResponse } from "next/server";
import { errorHandler } from "@/libs/errorHandler";
import { prisma } from "@/libs/prisma"
import bcrypt from 'bcrypt';

export async function GET(request: Request) {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                isAdmin: true,
            },
        });
        return NextResponse.json(users, { status: 200 });

    } catch (error) {
        if (error instanceof Error) {
            return errorHandler(500, "Error in fetching users" + error.message);
        }
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()

        const { email, password, name, isAdmin } = body;

        if (!email || !password || !name) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }

        const existingUserByEmaill = await prisma.user.findUnique({
            where: { email: email }
        })

        if (existingUserByEmaill) {
            return NextResponse.json({ error: "User with this email" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                isAdmin: isAdmin || false,
            },
        });

        // Remove the password from the response object to avoid exposing it
        const { password: newUserPassword, ...rest } = newUser;


        return NextResponse.json({
            message: "User registered successfully",
            user: rest,
        });
    } catch (error) {
        if (error instanceof Error) {
            return errorHandler(500, "Error creating users" + error.message);
        }
    }
}
