import { NextRequest, NextResponse } from "next/server";
import { RouteParams } from "@/types/routes";
import { auth } from "@/lib/auth";
import { ApiError } from "@/lib/errors";
import { createComment, getComments } from "@/db/queries/task";
export async function POST(request: NextRequest, { params }: RouteParams) {
  const session = await auth();
  if (!session?.user?.id) return ApiError.unauthorized();

  const id = (await params).id;
  try {
    const body = await request.json();
    if (!body.comment || typeof body.comment !== "string") {
      return ApiError.badRequest("Comment is required");
    }
    const [comment] = await createComment(session.user.id, id, body.comment);
    if (!comment) return ApiError.badRequest("Unkown error");
    return NextResponse.json(
      {
        comment,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error(error);
    if (error instanceof Error) return ApiError.queryError(error);
    return ApiError.server();
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const session = await auth();
  if (!session?.user?.id) return ApiError.unauthorized();
  const id = (await params).id;
  try {
    const comments = await getComments(id);
    if (!comments) return ApiError.server();
    return NextResponse.json(
      {
        comments,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    return ApiError.server();
  }
}
