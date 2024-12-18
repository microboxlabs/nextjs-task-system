import { eq, and, sql } from "drizzle-orm";
import { isUserAdmin, queryErrors } from ".";
import { db } from "..";
import { groupMemberships, groups, users } from "../schema";

// For users we return the groups they are a part of
// For admins we return all the groups with the users
export async function getGroups(userId: string) {
  const isAdmin = await isUserAdmin(userId);
  if (isAdmin) {
    return await db.query.groups.findMany({
      with: {
        memberships: {
          with: {
            user: true,
          },
        },
      },
    });
  } else {
    return await db.query.groupMemberships.findMany({
      where: eq(groupMemberships.userId, userId),
      with: {
        group: true,
      },
    });
  }
}

export async function createGroup(userId: string, name: string) {
  await isUserAdmin(userId);
  return await db.insert(groups).values({ name }).returning();
}

export async function deleteGroup(userId: string, groupId: string) {
  await isUserAdmin(userId);

  return db.delete(groups).where(eq(groups.id, groupId)).returning();
}

export async function updateGroup(
  userId: string,
  groupId: string,
  name: string,
) {
  await isUserAdmin(userId);
  const groupExist = await db.query.groups.findFirst({
    where: eq(groups.id, groupId),
  });
  if (!groupExist) throw new Error(queryErrors.notFound);

  return await db
    .update(groups)
    .set({ name })
    .where(eq(groups.id, groupId))
    .returning();
}

export async function createUserMembership(
  userId: string,
  targetId: string,
  groupId: string,
) {
  await isUserAdmin(userId);

  const targetUser = await db.query.users.findFirst({
    where: eq(users.id, targetId),
  });
  const targetGroup = await db.query.groups.findFirst({
    where: eq(groups.id, groupId),
  });
  if (!targetUser || !targetGroup) throw new Error(queryErrors.notFound);

  const userInGroup = await userMembership(targetId, groupId);
  if (userInGroup) throw new Error(queryErrors.duplicate);

  await db.insert(groupMemberships).values({ userId: targetId, groupId });
  return await db.query.groupMemberships.findFirst({
    where: and(
      eq(groupMemberships.groupId, groupId),
      eq(groupMemberships.userId, targetId),
    ),
    with: {
      group: true,
    },
  });
}

export async function removeUserMembership(
  userId: string,
  membershipId: string,
) {
  await isUserAdmin(userId);
  return await db
    .delete(groupMemberships)
    .where(eq(groupMemberships.id, membershipId))
    .returning();
}

export async function userMembership(userId: string, groupId: string) {
  return await db.query.groupMemberships.findFirst({
    where: and(
      eq(groupMemberships.userId, userId),
      eq(groupMemberships.groupId, groupId),
    ),
  });
}
