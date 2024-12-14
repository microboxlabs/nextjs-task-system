import { Task, User } from "@prisma/client";

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
  user: UserPartial;
}

export interface TaskWithAssignments extends Task {
  assignments: Assignment[];
}
