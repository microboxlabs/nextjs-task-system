import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: Promise<{ userId: string }> },
) {
  const { userId } = await params;
  const groups = await prisma.groupMembers.findMany({
    relationLoadStrategy: "join",
    where: {
      userId: userId,
    },
    include: {
        group: true,
    },
  });
  return Response.json(groups);
}