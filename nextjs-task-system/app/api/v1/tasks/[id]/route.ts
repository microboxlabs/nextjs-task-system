import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { ApiError } from "@/lib/errors";
import {
  updateTask,
  updateTaskPriorityStatus,
  UpdateTaskT,
} from "@/db/queries/task";
import { deleteTask, getTaskById } from "@/db/queries/task";
import { updateTaskSchema } from "@/db/z-tasks";
import { RouteParams } from "@/types/routes";
// params are now async and need to be waited:
// https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes

// ? Is it required a details endpoint?
export async function GET(request: NextRequest, { params }: RouteParams) {
  const session = await auth();
  if (!session) return ApiError.unauthorized();

  const id = (await params).id;
  const task = await getTaskById(id);
  if (!task) {
    return NextResponse.json(
      { message: "Not found" },
      {
        status: 404,
      },
    );
  }
  return NextResponse.json({ task }, { status: 200 });
}

// Use Put to update title, description, dueDate
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const session = await auth();
  if (!session?.user?.id) return ApiError.unauthorized();

  const id = (await params).id;

  try {
    const body = await request.json();
    const parsedBody = updateTaskSchema.parse(body);
    const task = await updateTask(session.user?.id, id, parsedBody);
    if (!task) return ApiError.server();
    return NextResponse.json(
      {
        task,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    if (error instanceof Error) return ApiError.queryError(error);
    return ApiError.server();
  }
}

// Use patch to update the priority or status
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const session = await auth();
  if (!session?.user?.id) return ApiError.unauthorized();

  const id = (await params).id;

  try {
    const { status, priority } = (await request.json()) as UpdateTaskT;
    if (!status && !priority) {
      return ApiError.miscError(
        "Bad Request",
        "Status or priority is required",
        400,
      );
    }
    const updatedTask = await updateTaskPriorityStatus(
      id,
      status ? { status } : { priority },
    );
    return NextResponse.json(
      {
        task: updatedTask,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    return ApiError.server();
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const session = await auth();
  if (!session || !session.user || !session.user.id)
    return ApiError.unauthorized();

  const id = (await params).id;

  try {
    const deletedTask = await deleteTask(id, session.user?.id);
    if (!deletedTask) throw new Error("Unkown Error");
    return NextResponse.json(
      {
        message: "Task deleted successfully",
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    return ApiError.server();
  }
}
