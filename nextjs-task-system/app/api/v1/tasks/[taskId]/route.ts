import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const GET = async (request: Request, { params }: { params: Promise<{ taskId: string }> }) => {
    const { taskId } = await params;
    const task = await prisma.tasks.findUnique({
        where: {
            id: taskId,
        }
    });
    return Response.json(task);
};

export const PUT = async (request: Request, { params }: { params: Promise<{ taskId: string }> }) => {
    const { taskId } = await params;
    const { status } = await request.json();
    const updatedTask = await prisma.tasks.update({
        where: {
            id: taskId,
        },
        data: {
            status,
        }
    });
    return Response.json(updatedTask);
};

export const DELETE = async (request: Request, { params }: { params: Promise<{ taskId: string }> }) => {
    const { taskId } = await params;
    const deletedTask = await prisma.tasks.delete({
        where: {
            id: taskId,
        }
    });
    return Response.json(deletedTask);
};