import { getUserById } from "@/db/queries/user";
import { auth } from "@/lib/auth";
import { ApiError } from "@/lib/errors";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return ApiError.unauthorized();

  try {
    const userData = await getUserById(session.user.id);
    if (!userData) return ApiError.server();
    return NextResponse.json(
      {
        user: userData,
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
