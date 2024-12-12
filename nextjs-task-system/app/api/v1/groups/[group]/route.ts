import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: Promise<{ group: string }> },
) {
  const { group } = await params;
  const groups = await prisma.groups.findUnique({
    relationLoadStrategy: "join",
    where: {
      id: group,
    },
    include: {
      members: true,
      tasks: true,
    },
  });
  return Response.json(groups);
}
