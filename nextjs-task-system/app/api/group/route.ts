import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma"

import { errorHandler } from "@/libs/errorHandler";

export async function GET() {
    try {
        const groups = await prisma.group.findMany({
            include: { users: true },  // Incluir los usuarios asociados a cada grupo
        });

        return NextResponse.json(groups);
    } catch (error) {
        console.error(error);
        if (error instanceof Error) {
            return errorHandler(500, "Failed to fetch groups" + error.message);
        }
    }
}


export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, userId } = body;

        if (!name) {
            return NextResponse.json({ error: "Group name is required" }, { status: 400 });
        }

        // Crear el grupo
        const newGroup = await prisma.group.create({
            data: {
                name,
                // Si se pasa userId, conectamos al usuario al grupo
                ...(userId && {
                    users: {
                        connect: { id: userId },
                    },
                }),
            },
        });

        return NextResponse.json({
            message: "Group created successfully",
            group: newGroup,
        });
    } catch (error) {
        if (error instanceof Error) {
            return errorHandler(500, "Failed to create group" + error.message);
        }
    }
}

