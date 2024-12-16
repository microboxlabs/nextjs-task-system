import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { Prisma } from "@prisma/client";
import { CreateUserOrGroup } from "@/app/types";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { user } = session;

  // get params
  const url = new URL(req.url);
  const userIdOrGroupId = url.searchParams.get("userIdOrGroupId");
  const status = url.searchParams.get("status");
  const priority = url.searchParams.get("priority");
  const sortBy = url.searchParams.get("sortBy") || "createdAt";
  const direction = url.searchParams.get("direction") || "desc";

  console.log(userIdOrGroupId, "userIdOrGroupId");

  // validate userId
  const [type, id] = userIdOrGroupId?.split(",") || ["", ""];
  const userIdInt = type === "user" && id ? parseInt(id, 10) : undefined;
  const groupIdInt = type === "group" && id ? parseInt(id, 10) : undefined;
  if (type === "user" && isNaN(parseInt(id))) {
    return NextResponse.json({ error: "Invalid userId" }, { status: 400 });
  }

  if (type === "group" && isNaN(parseInt(id))) {
    return NextResponse.json({ error: "Invalid groupId" }, { status: 400 });
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

  // build dynamic filter
  const filter: Prisma.TaskWhereInput =
    user.role === "Admin"
      ? {} // If the user is Admin, fetch all tasks
      : {
          OR: [
            {
              assignments: {
                some: { userId: parseInt(user.id) }, // Filter by user assignments
              },
            },
            {
              assignments: {
                some: {
                  groupId: {
                    in: await prisma.groupMembership
                      .findMany({
                        where: { userId: parseInt(user.id) }, // Get the groups the user belongs to
                        select: { groupId: true }, // Only fetch the groupId
                      })
                      .then((memberships) =>
                        memberships.map((membership) => membership.groupId),
                      ), // Map to get only the groupIds
                  },
                }, // Filter by group memberships
              },
            },
          ],
        };

  // Filter by userId if exists
  if (userIdInt) {
    filter.OR = [
      ...(filter.OR || []),
      {
        assignments: {
          some: { userId: userIdInt },
        },
      },
    ];
  }
  // Filter by groupId if exists
  if (groupIdInt) {
    filter.OR = [
      ...(filter.OR || []),
      {
        assignments: {
          some: { groupId: groupIdInt },
        },
      },
    ];
  }

  // Filter by status if exists
  if (status) {
    filter.status = status;
  }

  // Filter by priority if exists
  if (priority) {
    filter.priority = priority;
  }

  // build dynamic sort
  const orderBy = {
    [sortBy]: direction,
  };

  // Fetch tasks with assignments (users and groups)
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
          group: {
            // Include group information
            select: {
              id: true,
              name: true,
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
        { error: "AssignedTo must be a non-empty array of user/group IDs" },
        { status: 400 },
      );
    }

    // Validate assignments
    const validAssignments = assignedTo.map((assignment: CreateUserOrGroup) => {
      if (assignment.type === "user" && !assignment.userId) {
        throw new Error("User ID is required for user type assignment");
      }
      if (assignment.type === "group" && !assignment.groupId) {
        throw new Error("Group ID is required for group type assignment");
      }

      return {
        userId: assignment.type === "user" ? assignment.userId : undefined,
        groupId: assignment.type === "group" ? assignment.groupId : undefined,
      };
    });

    const newTask = await prisma.task.create({
      data: {
        title,
        description,
        dueDate: new Date(dueDate),
        priority,
        assignments: {
          create: validAssignments.map((assignment) => ({
            userId: assignment.userId,
            groupId: assignment.groupId,
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
