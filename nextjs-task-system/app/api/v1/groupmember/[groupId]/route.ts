import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: Promise<{ groupId: string }> },
) {
  const { groupId } = await params;
  console.log(groupId);
  const groups = await prisma.groupMembers.findMany({
    relationLoadStrategy: "join",
    where: {
      groupId: groupId,
    },
    include: {
      user: true,
    },
  });
  return Response.json(groups);
}