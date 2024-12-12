import { UserPartial } from "@/app/types";
import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { user } = session;

  // Fetch all users only if the user is an Admin
  let users: UserPartial[] = [];
  if (user.role === "Admin") {
    users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });
  }

  return NextResponse.json(users);
}
