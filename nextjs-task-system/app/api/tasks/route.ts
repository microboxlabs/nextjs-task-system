import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma"

import { errorHandler } from "@/libs/errorHandler";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";

export async function GET(request: Request) {
    try {
    
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = parseInt(session.user.id, 10);
        const isAdmin = session.user.isAdmin;

        let tasks;

        if (isAdmin) {
            // Si es ADMIN, obtiene todas las tareas
            tasks = await prisma.task.findMany();
        } else {
            // Si no es ADMIN, obtiene solo las tareas del usuario
            tasks = await prisma.task.findMany({
                where: { assignedToId: userId },
            });
        }

        return NextResponse.json(tasks);
    } catch (error) {
        if (error instanceof Error) {
            return errorHandler(500, "Failed to fetch tasks" + error.message);
        }
    }
};

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { title, description, assignedToId, dueDate, priority } = body;

        if (!title || !assignedToId || !priority) {
            return errorHandler(400, "Title, AssignedTo, and Priority are required");
        }

        const userExists = await prisma.user.findUnique({
            where: { id: assignedToId },
        });

        if (!userExists) {
            return errorHandler(400, "User with the provided ID does not exist.");
        }

        const task = await prisma.task.create({
            data: {
                title,
                description,
                assignedTo: {
                    connect: { id: assignedToId },
                },
                dueDate: dueDate ? new Date(dueDate) : null,
                priority,
                status: "Pending",
            },
        });

        return NextResponse.json(task, { status: 201 });
    } catch (error) {
        if (error instanceof Error) {
            return errorHandler(500, "Failed to create task" + error.message);
        }
    }
}