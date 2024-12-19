import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/utils/prisma";
import { authorizeUser } from "@/utils/authUtils";

// Obtener todas las tareas del usuario (GET)
export async function GET(req: NextRequest) {
    try {
        const { status, response, session } = await authorizeUser('user');

        if (status !== 200) {
            return response;
        }

        const userId = session?.user.userId;
        const userTasks = await prisma.task.findMany({
            where: { idAssignedTo: userId },
        });

        const userGroups = await prisma.userGroup.findMany({
            where: { userId },
            select: { groupId: true },
        });

        const groupIds = userGroups.map(group => group.groupId);
        const groupTasks = await prisma.task.findMany({
            where: {
                idAssignedTo: { in: groupIds },
            },
        });

        const allUserTasks = [...userTasks, ...groupTasks];

        return NextResponse.json(allUserTasks, { status: 200 });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ error: "Could not delete Group" }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}

// Actualizar una tarea (PUT)
export async function PUT(req: NextRequest) {
    try {
        const { status, response } = await authorizeUser('user');
        if (status !== 200) {
            return response;
        }

        const body = await req.json();
        const { id, comments } = body as { id: number; comments: string };

        if (!id || !comments) {
            return NextResponse.json({ error: "Missing required fields: 'id' and 'comments'" }, { status: 400 });
        }

        //Si está Pending debe pasar a In Progress y si está en In Progress, debe pasar a Completed
        const actualStatus = await prisma.task.findUnique({
            where: { id }
        })

        let newStatus

        if (actualStatus?.status === 'Pending') {
            newStatus = 'In Progress'
        } else if (actualStatus?.status === 'In Progress') {
            newStatus = 'Completed'
        }

        const taskUpdated = await prisma.task.update({
            where: { id },
            data: {
                comments,
                status: newStatus
            }
        });

        return NextResponse.json({ message: "Task updated successfully", taskUpdated }, { status: 200 });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ error: "Could not update Task" }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}