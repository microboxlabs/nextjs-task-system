import { db } from "..";
import { isUserAdmin, queryErrors } from ".";
import { UserRoles, users } from "../schema";
import { eq } from "drizzle-orm";

export async function getUsers(userId: string) {
  await isUserAdmin(userId);
  return db.query.users.findMany({
    with: {
      groupMemberships: {
        with: {
          group: true,
        },
      },
    },
  });
}

export async function getUserById(userId: string) {
  return db.query.users.findFirst({
    where: eq(users.id, userId),
  });
}

export async function updateUserRole(
  userId: string,
  targetUserId: string,
  newRole: UserRoles,
) {
  await isUserAdmin(userId);
  const targetUser = await db.query.users.findFirst({
    where: eq(users.id, targetUserId),
  });
  if (!targetUser) throw new Error(queryErrors.notFound);
  return db
    .update(users)
    .set({ role: newRole })
    .where(eq(users.id, targetUserId))
    .returning();
}
