import { eq } from "drizzle-orm";
import { db } from "..";
import { UserRoleValues, users } from "../schema";

/**
 * This file is meant to be used for all the queries util function values
 * generic queries or aditional validators
 * ! Do not use as barrel file
 */

export const queryErrors = {
  admin: "no-admin",
  notFound: "not-found",
  duplicate: "duplicated",
};

// TODO -> Should be refactored to be included on the session
export async function isUserAdmin(userId: string) {
  const user = await db.query.users.findFirst({ where: eq(users.id, userId) });
  if (!user) throw new Error(queryErrors.notFound);
  if (user.role !== UserRoleValues.ADMIN) throw new Error(queryErrors.admin);
  return true;
}
