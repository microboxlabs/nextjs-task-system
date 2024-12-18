import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { ApiError } from "@/lib/errors";
import { UserRoles, UserRoleValues } from "@/db/schema";
import { updateUserRole } from "@/db/queries/user";
type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const session = await auth();
  if (!session?.user?.id) return ApiError.unauthorized();

  const id = (await params).id;
  try {
    const body = await request.json();
    if (!body.role || !Object.keys(UserRoleValues).includes(body.role)) {
      return ApiError.badRequest("Role is required");
    }
    const updatedUser = await updateUserRole(
      session.user.id,
      id,
      body.role as UserRoles,
    );
    if (!updatedUser) throw new Error("Unknown");
    return NextResponse.json(
      {
        message: "Success",
      },
      {
        status: 202,
      },
    );
  } catch (error) {
    return ApiError.server();
  }
}
