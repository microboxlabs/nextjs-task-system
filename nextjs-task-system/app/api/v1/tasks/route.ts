import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const GET = async () => {
  const tasks = await prisma.tasks.findMany({
    relationLoadStrategy: "join",
    include: {
      user: true,
      comments: true,
    },
  });
  return Response.json(tasks);
};

export const POST = async (req: NextRequest) => {
  const { title, description, assigned_to, status, group_id, due_date, priority } =
    await req.json();
  const task = await prisma.tasks.create({
    data: {
      title,
      description,
      status,
      assigned_to,
      group_id,
      due_date,
      priority,
    },
  });
  return Response.json(task);
};
