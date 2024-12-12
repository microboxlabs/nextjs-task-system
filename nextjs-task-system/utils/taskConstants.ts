import { TaskPriority } from "@/types/taskTypes";

export const priorityOptions: {
  [key: string]: { label: string; value: TaskPriority };
} = {
  low: { label: "Low", value: "low" },
  medium: { label: "Medium", value: "medium" },
  high: { label: "High", value: "high" },
};
