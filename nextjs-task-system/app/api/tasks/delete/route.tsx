import { verifyToken } from "@/actions/token/token-actions";
import prisma from "@/lib/prisma";
import { Task } from "@/types/tasks-types";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

import { NextRequest, NextResponse } from "next/server";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function DELETE(req: NextRequest) {


    const token = req.headers.get("Authorization")?.replace("Bearer ", "");

    if (req.method !== "DELETE") {
        return NextResponse.json({ message: "Method not allowed", status: 405 });
    }

    try {
        const { id } = await req.json();

        if (!token) {
            return NextResponse.json(
                { message: "Token not found" },
                { status: 401 }
            );
        }
        try {
            const { payload } = await jwtVerify(token, secret);
            verifyToken(payload);
        } catch (error) {
            if (error instanceof Error && "code" in error && error.code === "EXPIRED-TOKEN") {
                return NextResponse.json({ message: "Token has expired", status: 401 });
            }
            console.error(error);
            return NextResponse.json({ message: "Invalid token", status: 401 });
        }

        const task = await prisma.task.findUnique({
            where: { id },
        });

        if (!task) {
            return NextResponse.json({ message: "Task not found", status: 404 });
        }
        await prisma.task.delete({
            where: { id },

        });



        return NextResponse.json({
            message: "Task deleted successfully",
            status: 200,
        });

    } catch (error) {
        console.error("Error updating task:", error);

        return NextResponse.json(
            { message: "Internal server error", status: 500 }
        );
    }
}
