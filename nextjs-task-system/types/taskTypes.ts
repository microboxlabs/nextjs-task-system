export type TaskPriority = "low" | "medium" | "high";
export type TaskStatus = "pending" | "inProgress" | "completed";

export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  dueDate: string;
  assignedTo: string;
  priority: TaskPriority;
  comments: string[];
}
