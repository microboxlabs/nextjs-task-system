import { Comment, Group, Task, User } from "@prisma/client";

export type TaskStatus = "Pending" | "InProgress" | "Completed";

export interface UserPartial
  extends Pick<User, "id" | "name" | "email" | "role"> {}

export interface Column {
  name: string;
  tasks: TaskWithAssignments[];
}

export interface BoardData {
  columns: Record<TaskStatus, Column>;
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

export interface CommentWithUser extends Comment {
  user: UserPartial;
}
