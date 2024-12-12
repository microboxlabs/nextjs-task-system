import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { user } = session;

  const tasks = await prisma.task.findMany({
    //@ts-ignore
    where:
      user.role === "Admin" ? {} : { assignments: { some: { id: user.id } } }, // filter only to the user
    include: {
      assignments: {
        select: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              role: true,
            },
          },
        },
      },
    },
  });

  return NextResponse.json(tasks);
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== "Admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, description, assignedTo, dueDate, priority } =
      await req.json();

    if (!Array.isArray(assignedTo) || assignedTo.length === 0) {
      return NextResponse.json(
        { error: "AssignedTo must be a non-empty array of user IDs" },
        { status: 400 },
      );
    }

    const newTask = await prisma.task.create({
      data: {
        title,
        description,
        dueDate: new Date(dueDate),
        priority,
        assignments: {
          //@ts-ignore
          create: assignedTo.map((userId: string) => ({
            userId,
          })),
        },
      },
      include: {
        assignments: true,
      },
    });

    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 },
    );
  }
}
