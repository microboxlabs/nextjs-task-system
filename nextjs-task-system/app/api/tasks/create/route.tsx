import { saveMessageAndTask } from "@/actions/notifications/notifications-actions";
import { verifyToken } from "@/actions/token/token-actions";
import prisma from "@/lib/prisma";
import { Task } from "@/types/tasks-types";

import { jwtVerify } from "jose";
import { cookies } from "next/headers";

import { NextRequest, NextResponse } from "next/server";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function POST(req: NextRequest) {
  {
    /*verify the existence of the jwt token*/
  }
  const cookieStore = cookies();
  const tokenFromCookie = cookieStore.get("tokenLogin")?.value;
  const tokenFromHeaders = req.headers.get("Authorization")?.split(" ")[1];
  const token = tokenFromCookie || tokenFromHeaders;
  //Send data to sqlLite and returns the same data to the front to post the card
  if (req.method === "POST") {
    const { title, description, assigned, typeOfAssigned, dueDate, priority } =
      await req.json();
    try {
      if (!token) {
        return NextResponse.json(
          { message: "Token not found in cookies" },
          { status: 401 },
        );
      }
      try {
        const { payload } = await jwtVerify(token, secret);
        verifyToken(payload);
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
          message: "Internal server error",
          data: [],
          status: 500,
        });
      }
      const task = await prisma.task.create({
        data: {
          title: title,
          description: description,
          assignedToGroupId: typeOfAssigned !== "person" ? assigned : null,
          assignedToUserId: typeOfAssigned === "person" ? assigned : null,
          priorityId: priority,
          dueDate: dueDate,
        },
        include: {
          group: {
            select: {
              name: true,
              id: true,
            },
          },
          user: {
            select: {
              name: true,
              id: true,
            },
          },
          priority: {
            select: {
              name: true,
              id: true,
            },
          },
          status: {
            select: {
              name: true,
              id: true,
            },
          },
          comments: {
            select: {
              content: true,
              user: { select: { name: true, id: true } },
            },
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
        comments: task.comments ?? [],
        creationDate: task.creationDate,
      };

      await saveMessageAndTask(
        formattedTask,
        token,
        `Se ha creado la tarea "${formattedTask.title}".`,
      );
      return NextResponse.json({
        message: "Task created successfully",
        data: task,
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
        message: "Internal server error",
        data: [],
        status: 500,
      });
    }
  } else {
    return NextResponse.json({
      message: "Internal server error",
      data: [],
      status: 401,
    });
  }
}
