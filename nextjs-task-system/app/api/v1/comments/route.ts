import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const GET = async () => {
  const tasks = await prisma.comments.findMany();
  return Response.json(tasks);
};

export const POST = async (req: NextRequest) => {
  const { comment, task_id, user_id } = await req.json();
    const newComment = await prisma.comments.create({
        data: {
            comment,
            task_id,
            user_id,
        },
    });
    return Response.json(newComment);
}