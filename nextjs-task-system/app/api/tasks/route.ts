import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { Prisma } from "@prisma/client";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { user } = session;

  // get params
  const url = new URL(req.url);
  const userId = url.searchParams.get("userId");
  const status = url.searchParams.get("status");
  const sortBy = url.searchParams.get("sortBy") || "createdAt";
  const direction = url.searchParams.get("direction") || "desc";

  // validate userId
  const userIdInt = userId ? parseInt(userId, 10) : undefined;
  if (userId && isNaN(userIdInt as any)) {
    return NextResponse.json({ error: "Invalid userId" }, { status: 400 });
  }

  // Validate sortBy
  const validSortFields = ["dueDate", "priority", "createdAt"];
  if (!validSortFields.includes(sortBy)) {
    return NextResponse.json(
      {
        error: `Invalid sortBy value. Allowed values are: ${validSortFields.join(", ")}`,
      },
      { status: 400 },
    );
  }

  // Validate direction
  if (direction !== "asc" && direction !== "desc") {
    return NextResponse.json(
      { error: "Invalid direction value. Allowed values are: 'asc', 'desc'" },
      { status: 400 },
    );
  }

  // build dinamyc filter
  const filter: Prisma.TaskWhereInput =
    user.role === "Admin"
      ? {}
      : {
          assignments: {
            some: { userId: parseInt(user.id) },
          },
        };

  // Filter by userId if exist
  if (userIdInt) {
    filter.assignments = {
      ...filter.assignments,
      some: { ...filter.assignments?.some, userId: userIdInt },
    };
  }

  // Filter by status if exist
  if (status) {
    filter.status = status;
  }

  // build dynamic sort
  const orderBy = {
    [sortBy]: direction,
  };

  const tasks = await prisma.task.findMany({
    where: filter,
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
    orderBy,
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
