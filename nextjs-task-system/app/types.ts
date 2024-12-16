import { Group, Task, User } from "@prisma/client";

export interface UserPartial
  extends Pick<User, "id" | "name" | "email" | "role"> {}

export interface Column {
  name: string;
  tasks: TaskWithAssignments[];
}

export interface BoardData {
  columns: Record<string, Column>;
}

export interface Assignment {
  user?: UserPartial;
  group?: Group;
}

export interface TaskWithAssignments extends Task {
  assignments: Assignment[];
}
export type UserOrGroup = "user" | "group";

export interface CreateUserOrGroup {
  type: UserOrGroup;
  userId?: number;
  groupId?: number;
}
