import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { ApiError } from "@/lib/errors";
import { getUsers } from "@/db/queries/user";
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return ApiError.unauthorized();
  const users = await getUsers(session.user.id);
  return NextResponse.json({ users }, { status: 200 });
}
