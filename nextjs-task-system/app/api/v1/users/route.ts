import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export const GET = async() => {
    const users = await prisma.users.findMany();
    return Response.json(users);
}

export const POST = async(req: NextRequest) => {
    const { name, email, password } = await req.json();
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.users.create({
        data: {
            name,
            email,
            password: hashedPassword
        }
    });
    return Response.json(user);
}

export const PUT = async(req: NextRequest) => {
    const { id, name, email, password } = await req.json();
    const user = await prisma.users.update({
        where: { id },
        data: {
            name,
            email,
            password
        }
    });
    return Response.json(user);
}

export const DELETE = async(req: NextRequest) => {
    const { id } = await req.json();
    const user = await prisma.users.delete({
        where: { id }
    });
    return Response.json(user);
}