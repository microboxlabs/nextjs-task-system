import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma"

import { errorHandler } from "@/libs/errorHandler";


type Params = {
    params: { id: string }
}

export async function PATCH(request: Request, { params }: Params) {
    try {
        const body = await request.json();
        const { name, userId } = body;
        const id = params.id;

        console.log(id)
        if (!id || isNaN(Number(id)) || !name || !userId || isNaN(Number(userId))) {
            return errorHandler(400, "Valid group ID, user ID, and name are required");
        }

        const group = await prisma.group.findUnique({
            where: { id: Number(id) },
            include: { users: true }, // Incluir los usuarios del grupo
        });

        if (!group) {
            return errorHandler(404, "Group not found");
        }

        const user = await prisma.user.findUnique({
            where: { id: Number(userId) },
        });

        if (!user) {
            return errorHandler(404, "User not found");
        }

        let updatedGroup;
        if (userId) {
            updatedGroup = await prisma.group.update({
                where: { id: Number(id) },
                data: {
                    name,
                    users: {
                        connect: { id: Number(userId) },  // Conectamos al usuario al grupo
                    },
                },
            });
        } else {
            // Si no se pasa un `userId`, solo actualizamos el nombre
            updatedGroup = await prisma.group.update({
                where: { id: Number(id) },
                data: { name },
            });
        }

        return NextResponse.json({
            message: "User added to group successfully",
            group: updatedGroup,
        });
    } catch (error) {
        if (error instanceof Error) {
            return errorHandler(500, "Failed to update group" + error.message);
        }
    }
}

export async function DELETE(request: Request, { params }: Params) {
    try {
        const id = params.id;

        if (!id) {
            return errorHandler(400, "Group ID is required");
        }

        await prisma.group.delete({ where: { id: Number(id) } });

        return NextResponse.json({ message: "Group deleted successfully." });
    } catch (error) {
        if (error instanceof Error) {
            return errorHandler(500, "Failed to delete group" + error.message);
        }
    }
}

