import { verifyToken } from "@/actions/token/token-actions";
import prisma from "@/lib/prisma";
import { FormatedFilters, Task } from "@/types/tasks-types";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function GET(req: NextRequest) {
  {
    /*verify the existence of the jwt token*/
  }
  const cookieStore = cookies();
  const tokenFromCookie = cookieStore.get("tokenLogin")?.value;
  const tokenFromHeaders = req.headers.get("Authorization")?.split(" ")[1];
  const token = tokenFromCookie || tokenFromHeaders;

  if (!token) {
    return NextResponse.json(
      { message: "Token not found in cookies" },
      { status: 401 },
    );
  }

  try {
    const { payload } = await jwtVerify(token, secret);
    verifyToken(payload);

    // Extract query parameters from the request
    const { searchParams } = new URL(req.url);
    const statusParam = searchParams.get("status");
    const filters: FormatedFilters = {
      typeOfAssigned: searchParams.get("typeOfAssigned") || "",
      assignedUserOrGroup:
        Number(searchParams.get("assignedUserOrGroup") || "0") || 0,
      priority: Number(searchParams.get("priority")) || 0,
      sortBy: searchParams.get("sortBy") || "dueDate",
      sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") || "asc",
      status: statusParam
        ? statusParam
            .split(",")
            .map((status) => parseInt(status))
            .filter((status) => !isNaN(status))
        : [],
    };

    // Construct query object based on the filters
    const query: any = {};

    if (filters.status.length > 0) {
      query.status = { id: { in: filters.status } };
    }

    if (filters.priority) {
      query.priority = { id: filters.priority };
    }

    if (filters.assignedUserOrGroup) {
      if (filters.typeOfAssigned === "person") {
        query.assignedToUserId = filters.assignedUserOrGroup;
        delete query.assignedToGroupId;
      } else if (filters.typeOfAssigned === "group") {
        query.assignedToGroupId = filters.assignedUserOrGroup;
        delete query.assignedToUserId;
      }
    }

    // Sort handling
    const order: { [key: string]: "asc" | "desc" } = {};
    order[filters.sortBy] = filters.sortOrder;

    const tasks = await prisma.task.findMany({
      where: query,
      orderBy: order,
      include: {
        priority: { select: { name: true, id: true } },
        status: { select: { name: true, id: true } },
        user: { select: { name: true, id: true } },
        group: { select: { name: true, id: true } },
        comments: {
          select: { content: true, user: { select: { name: true, id: true } } },
        },
      },
    });

    if (!tasks || tasks.length === 0) {
      return NextResponse.json({
        message: "No tasks found",
        data: [],
        status: 404,
      });
    }

    const formattedTasks: Task[] = tasks.map((task: Task) => ({
      id: task.id,
      title: task.title,
      status: task.status,
      user: task.user ? task.user : null,
      group: task.group ? task.group : null,
      dueDate: task.dueDate,
      priority: task.priority,
      description: task.description,
      comments: task.comments,
      creationDate: task.creationDate,
    }));

    return NextResponse.json({
      message: "Successful request",
      data: formattedTasks,
      status: 200,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      "code" in error &&
      error.code === "EXPIRED-TOKEN"
    ) {
      return NextResponse.json({
        message: "Token has expired",
        data: [],
        status: 401,
      });
    }

    console.error(error);
    return NextResponse.json({
      message: "Invalid token",
      data: [],
      status: 401,
    });
  }
}
