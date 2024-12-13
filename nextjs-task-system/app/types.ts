import { Task, User } from "@prisma/client";

export interface UserPartial
  extends Pick<User, "id" | "name" | "email" | "role"> {}

/* export interface TaskDrag
  extends Pick<Task, "id" | "title" | "description" | "priority"> {
  assignedTo: string;
  dueDate: string;
} */

export interface Column {
  name: string;
  tasks: Task[];
}

export interface BoardData {
  columns: Record<string, Column>;
}
