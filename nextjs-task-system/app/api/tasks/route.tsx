import { verifyToken } from "@/actions/token/token-actions";
import prisma from "@/lib/prisma";
import { Task } from "@/types/tasks-types";
import WebSocket from "ws";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function GET(req: NextRequest) {
  const cookieStore = cookies();
  const token = cookieStore.get("tokenLogin")?.value;

  if (!token) {
    return NextResponse.json(
      { message: "Token not found in cookies" },
      { status: 401 },
    );
  }

  try {
    const { payload } = await jwtVerify(token, secret);
    verifyToken(payload);

    const tasks = await prisma.task.findMany({
      include: {
        priority: { select: { name: true, id: true } },
        status: { select: { name: true, id: true } },
        user: { select: { name: true, id: true } },
        group: { select: { name: true, id: true } },
      },
    });

    if (!tasks || tasks.length === 0) {
      return NextResponse.json({
        message: "No tasks found",
        data: [],
        status: 404,
      });
    }

    const formattedTasks: Task[] = tasks.map((task) => ({
      id: task.id,
      title: task.title,
      status: task.status,
      user: task.user ? task.user : null,
      group: task.group ? task.group : null,
      dueDate: task.dueDate,
      priority: task.priority,
      description: task.description,
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
