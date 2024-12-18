import { deleteComment } from "@/db/queries/task";
import { auth } from "@/lib/auth";
import { ApiError } from "@/lib/errors";
import { NextRequest, NextResponse } from "next/server";

type CommentRouteParams = {
  params: Promise<{ id: string; commentId: string }>;
};
export async function DELETE(
  request: NextRequest,
  { params }: CommentRouteParams,
) {
  const session = await auth();
  if (!session?.user?.id) return ApiError.unauthorized();
  const { id, commentId } = await params;
  try {
    const [comment] = await deleteComment(session.user.id, commentId);
    if (!comment) return ApiError.server();
    return NextResponse.json(
      {
        comment: comment,
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
