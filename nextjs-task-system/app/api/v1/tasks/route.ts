import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);

  const filters: Record<string, any> = {
    assigned_to: searchParams.get("assigned_to") || undefined,
    group_id: searchParams.get("group_id") || undefined,
    due_date: searchParams.get("due_date") || undefined,
    priority: searchParams.get("priority") || undefined,
    create_date: searchParams.get("create_date") || undefined,
  };

  if (filters.due_date) {
    filters.due_date = new Date(filters.due_date).toISOString();
  }
  if(filters.create_date) {
    filters.create_date = new Date(filters.create_date).toISOString();
  }

  const tasks = await prisma.tasks.findMany({
    relationLoadStrategy: "join",
    include: {
      user: true,
      comments: true,
    },
    where: {
      assigned_to: filters.assigned_to || undefined,
      group_id: filters.group_id || undefined,
      due_date: filters.due_date || undefined,
      priority: filters.priority || undefined,
      created_at: filters.create_date || undefined,
    }
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
