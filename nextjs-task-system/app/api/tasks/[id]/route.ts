import { errorHandler } from "@/libs/errorHandler";
import { prisma } from "@/libs/prisma"
import { NextResponse } from "next/server";

type Params = {
    params: { id: string }
}

export async function PATCH(request: Request, { params }: Params) {
    try {
        const body = await request.json();
        const { title, description, assignedTo, dueDate, priority, status } = body;
        const taskId = params.id;

        console.log(taskId)
        if (!taskId || !status) {
            return errorHandler(400, "Task ID and Status are required");
        };

        if (!assignedTo) {
            return errorHandler(400, "Assigned user email is required");
        };

        const task = await prisma.task.findUnique({
            where: { id: Number(taskId) }, // Asegúrate de que taskId es un número
        });

        if (!task) {
            return errorHandler(404, "Task not found");
        }

        // Obtener el usuario mediante su correo electrónico
        const user = await prisma.user.findUnique({
            where: { email: assignedTo },  // Asegúrate de que el correo electrónico esté en minúsculas
        });

        if (!user) {
            return errorHandler(404, "User not found");
        };

        const updatedTask = await prisma.task.update({
            where: { id: Number(taskId) },  // Buscar la tarea por ID
            data: {
                title,
                description,
                assignedTo: {
                    connect: { id: user.id },  // Conectar la tarea con el usuario encontrado
                },
                dueDate: dueDate ? new Date(dueDate) : null,
                priority,
                status,
            },
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
            // Si no se encuentra la tarea, devolver un error 404 con mensaje adecuado
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