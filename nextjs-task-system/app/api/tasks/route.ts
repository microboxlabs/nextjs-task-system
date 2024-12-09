import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma"

import { errorHandler } from "@/libs/errorHandler";

export async function GET(request: Request) {
    try {
        const tasks = await prisma.task.findMany();

        return new Response(JSON.stringify(tasks), { status: 200 });
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


         // Convert assignedToId to an integer if it’s a string
        const assignedToIdInt = parseInt(assignedToId, 10);

        // Validate that assignedToId is a valid number
        if (isNaN(assignedToIdInt)) {
            return errorHandler(400, "AssignedToId must be a valid number");
        }

        // Check if the user with the provided assignedToId exists
        const userExists = await prisma.user.findUnique({
            where: { id: assignedToIdInt },
        });

        if (!userExists) {
            return errorHandler(400, "User with the provided ID does not exist.");
        }

        const task = await prisma.task.create({
            data: {
                title,
                description,
                assignedTo: {
                    connect: { id: assignedToIdInt }, // Associate the task with the user
                },
                dueDate: dueDate ? new Date(dueDate) : null, // If a due date is provided, convert it to a Date object
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
