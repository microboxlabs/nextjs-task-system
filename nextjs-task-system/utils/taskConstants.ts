import { TaskPriority, TaskStatus } from "@/types/taskTypes";

export const priorityOptions: { label: string; value: TaskPriority }[] = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
];

export const statusOptions: { label: string; value: TaskStatus }[] = [
  { label: "Pending", value: "pending" },
  { label: "In Progress", value: "inProgress" },
  { label: "Completed", value: "completed" },
];

export const assignTypeOptions: { label: string; value: "user" | "group" }[] = [
  { label: "User", value: "user" },
  { label: "Group", value: "group" },
];

export const groupOptions: { label: string; value: number }[] = [
  { label: "Admin Team", value: 1 },
  { label: "Frontend Team", value: 2 },
  { label: "Backend Team", value: 3 },
];
