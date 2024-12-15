export type TaskPriority = "low" | "medium" | "high";
export type TaskStatus = "pending" | "inProgress" | "completed";

export interface AssignedTo {
  type: "user" | "group";
  id: number;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  dueDate?: string;
  assignedTo?: AssignedTo;
  priority: TaskPriority;
  comments: string[];
  createdAt: string;
}

export interface CreateTask
  extends Omit<Task, "id" | "createdAt" | "comments"> {}

export interface UpdateTask extends Omit<Task, "createdAt" | "comments"> {
  comments?: string[];
}
