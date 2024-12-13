import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const GET = async (request: Request, { params }: { params: Promise<{ userId: string }> }) => {
    const { userId } = await params;
    const user = await prisma.users.findUnique({
        relationLoadStrategy: "join",
        where: {
            id: userId,
        },
        include: {
            groups: true,
        }
    });
    return Response.json(user);
};

export const PUT = async (request: Request, { params }: { params: Promise<{ userId: string }> }) => {
    const { userId } = await params;
    const { name, email, password } = await request.json();
    const updatedUser = await prisma.users.update({
        where: {
            id: userId,
        },
        data: {
            name,
            email,
            password,
        }
    });
    return Response.json(updatedUser);
};

export const DELETE = async (request: Request, { params }: { params: Promise<{ userId: string }> }) => {
    const { userId } = await params;
    const deletedUser = await prisma.users.delete({
        where: {
            id: userId,
        }
    });
    return Response.json(deletedUser);
};