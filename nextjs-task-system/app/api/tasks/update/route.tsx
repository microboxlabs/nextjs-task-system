import { verifyToken } from "@/actions/token/token-actions";
import prisma from "@/lib/prisma";
import { Task } from "@/types/tasks-types";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

import { NextRequest, NextResponse } from "next/server";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function PUT(req: NextRequest) { 




  if (req.method !== "PUT") {  
    return NextResponse.json({ message: "Method not allowed", status: 405 });
  }

  try {
    const { id, title, description, user, group, typeOfAssigned, priority,token } = await req.json();

    if (!token) {
      return NextResponse.json(
        { message: "Token not found in cookies" },
        { status: 401 }
      );
    }
    try {
      
      const { payload } = await jwtVerify(token, secret);
      verifyToken(payload);
    } catch (error) {
      if (error instanceof Error && "code" in error && error.code === "EXPIRED-TOKEN") {
        return NextResponse.json({ message: "Token has expired", status: 401 });
      }
      console.error(error);
      return NextResponse.json({ message: "Invalid token", status: 401 });
    }


    const task = await prisma.task.update({
      where: { id },
      data: {
        title,
        description,
        assignedToGroupId: typeOfAssigned !== "person" ? group : null,
        assignedToUserId: typeOfAssigned === "person" ? user : null,
        priorityId: priority,
      },
      include: {
        group: {
          select: { name: true, id: true },
        },
        user: {
          select: { name: true, id: true },
        },
        priority: {
          select: { name: true, id: true },
        },
        status: {
          select: { name: true, id: true },
        },
      },
    });

    const formattedTask: Task = {
      id: task.id,
      title: task.title,
      status: task.status,
      user: task.user ?? null,
      group: task.group ?? null,
      dueDate: task.dueDate,
      priority: task.priority,
      description: task.description,
    };

    return NextResponse.json({
      message: "Task updated successfully",
      data: formattedTask,
      status: 200,
    });

  } catch (error) {
    console.error("Error updating task:", error);

    return NextResponse.json(
      { message: "Internal server error", status: 500 }
    );
  }
}
