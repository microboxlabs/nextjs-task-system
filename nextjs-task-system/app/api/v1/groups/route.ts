import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const GET = async() => {
    const groups = await prisma.groups.findMany();
    return Response.json(groups);
}

export const POST = async(req: NextRequest) => {
    const { name } = await req.json();
    const group = await prisma.groups.create({
        data: {
            name
        }
    });
    return Response.json(group);
}

