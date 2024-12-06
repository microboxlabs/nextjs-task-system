import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma"

import { errorHandler } from "@/libs/errorHandler";

export async function GET(request: Request) {
    try {
        const tasks = await prisma.task.findMany({
            include: {
                assignedTo: true,
            },
        });


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