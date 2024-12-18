import { removeUserMembership } from "@/db/queries/group";
import { auth } from "@/lib/auth";
import { ApiError } from "@/lib/errors";
import { RouteParams } from "@/types/routes";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const session = await auth();
  if (!session?.user?.id) return ApiError.unauthorized();
  const id = (await params).id;
  try {
    const [response] = await removeUserMembership(session.user.id, id);
    if (!response) return ApiError.server();
    return NextResponse.json(
      {
        membership: response,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(error);
    ApiError.server();
  }
}
