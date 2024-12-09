import { errorHandler } from "@/libs/errorHandler";
import { prisma } from "@/libs/prisma"
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

type Params = {
    params: { id: string }
}

const validStatuses = ['Pending', 'In Progress', 'Completed'];

export async function PUT(request: Request, { params }: Params) {
    try {
        const body = await request.json();
        const { title, description, assignedTo, dueDate, priority, status } = body;
        const taskId = params.id;

        if (!taskId) {
            return errorHandler(400, "Task ID is required");
        };


        if (status && !validStatuses.includes(status)) {
            return errorHandler(400, "Invalid status value. Allowed values are 'Pending', 'In Progress', 'Completed'.");
        }

        const task = await prisma.task.findUnique({
            where: { id: Number(taskId) },
        });

        if (!task) {
            return errorHandler(404, "Task not found");
        }

        // Only update the fields that are provided in the body
        const updatedTaskData: any = {};

        if (title) updatedTaskData.title = title;
        if (description) updatedTaskData.description = description;
        if (assignedTo) {
            // If assignedTo is provided, find the user by their email and update the task’s assignee
            const user = await prisma.user.findUnique({
                where: { email: assignedTo },
            });
            if (!user) return errorHandler(404, "User not found");
            updatedTaskData.assignedTo = { connect: { id: user.id } };
        }
        if (dueDate) updatedTaskData.dueDate = new Date(dueDate);
        if (priority) updatedTaskData.priority = priority;
        if (status) updatedTaskData.status = status;

        // Si no se pasa ningún campo, el objeto se mantendrá vacío, lo que no hará cambios
        const updatedTask = await prisma.task.update({
            where: { id: Number(taskId) },
            data: updatedTaskData,
        });

        return NextResponse.json(updatedTask);
    } catch (error) {
        if (error instanceof Error) {
            return errorHandler(500, "Failed to update task." + error.message);
        }
    }
}

export async function DELETE(request: Request, { params }: Params) {
    try {
        const taskId = parseInt(params.id);

        const taskExists = await prisma.task.findUnique({
            where: { id: taskId },
        });

        if (!taskExists) {

            return NextResponse.json({ error: "Task not found" }, { status: 404 });
        }

        const deletedTask = await prisma.task.delete({
            where: { id: taskId }
        })

        return NextResponse.json({ message: "Task deleted successfully.", deletedTask },
            { status: 200 }
        );
    } catch (error) {
        if (error instanceof Error) {
            return errorHandler(500, "Failed to delete task." + error.message);
        }
    }
}
