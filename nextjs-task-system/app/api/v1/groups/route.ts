import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { ApiError } from "@/lib/errors";
import { createGroup, getGroups } from "@/db/queries/group";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return ApiError.unauthorized();
  try {
    const groups = await getGroups(session.user.id);
    return NextResponse.json({ groups }, { status: 200 });
  } catch (error) {
    return ApiError.server();
  }
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return ApiError.unauthorized();
  const body = await request.json();
  if (!body.name) {
    return ApiError.badRequest("Name is required");
  }
  try {
    const [newGroup] = await createGroup(session.user.id, body.name);
    return NextResponse.json(
      {
        group: newGroup,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error(error);
    return ApiError.server();
  }
}
