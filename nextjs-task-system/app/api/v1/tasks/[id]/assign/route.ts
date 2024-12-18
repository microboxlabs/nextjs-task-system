// TODO -> POST assign a user to a task
// TODO -> PUT update the user on the task
// TODO -> DELETE Remove the user from the task

import { assignTask, removeAssigned } from "@/db/queries/task";
import { auth } from "@/lib/auth";
import { ApiError } from "@/lib/errors";
import { NextRequest, NextResponse } from "next/server";
import { RouteParams } from "@/types/routes";

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const session = await auth();
  if (!session?.user?.id) return ApiError.unauthorized();

  const id = (await params).id;
  try {
    const body = await request.json();
    if (!body.targetId) return ApiError.badRequest("Target Id is required");
    if (!("isUser" in body)) return ApiError.badRequest("isUser is required");
    const task = await assignTask(
      session.user.id,
      body.targetId,
      id,
      body.isUser,
    );
    if (!task) throw new Error("Unkwon");

    return NextResponse.json(
      {
        task,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(error);
    return ApiError.server();
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const session = await auth();
  if (!session?.user?.id) return ApiError.unauthorized();

  const id = (await params).id;

  try {
    const task = await removeAssigned(session.user.id, id);
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
    return ApiError.server();
  }
}
