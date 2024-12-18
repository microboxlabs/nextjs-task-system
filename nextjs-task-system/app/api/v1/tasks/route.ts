import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createTask, getActiveTasks } from "@/db/queries/task";
import { createTaskSchema } from "@/db/z-tasks";
import { auth } from "@/lib/auth";
import { ApiError } from "@/lib/errors";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return ApiError.unauthorized();
  //? Should pagination be added?
  //? Or perhaps add a archived enum to limit query sizes
  const tasks = await getActiveTasks(session.user.id);
  return NextResponse.json({ tasks }, { status: 200 });
}

// Should be a formAction? Or a API?
// Is this going to integrate with other
// Apps?
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    return ApiError.unauthorized();
  }

  const body = await request.json();
  try {
    const parsedBody = createTaskSchema.parse(body);
    const task = await createTask(parsedBody, session.user.id);
    return NextResponse.json(
      {
        task,
      },
      {
        status: 201,
      },
    );
  } catch (err) {
    if (err instanceof z.ZodError) return ApiError.zodError(err);
    if (err instanceof Error && err.message === "no-admin") {
      return ApiError.miscError(
        "Unauthorized",
        "You can't perform this action",
        401,
      );
    }
    return ApiError.server();
  }
}
