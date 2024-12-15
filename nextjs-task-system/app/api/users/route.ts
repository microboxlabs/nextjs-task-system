import { UserPartial } from "@/app/types";
import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { user } = session;

  // dynamic query
  const userQuery: Prisma.UserFindManyArgs = {
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
    where: user.role !== "Admin" ? { id: parseInt(user.id) } : undefined, // only when user is not Admin
  };

  const users: UserPartial[] = await prisma.user.findMany(userQuery);

  return NextResponse.json(users);
}
