import { User } from "@prisma/client";

export interface UserPartial
  extends Pick<User, "id" | "name" | "email" | "role"> {}
