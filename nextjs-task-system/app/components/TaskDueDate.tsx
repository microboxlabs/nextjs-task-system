import React from "react";
import { formatDate } from "../utils/formatDate";

interface TaskDueDateProps {
  dueDate: string;
  label?: string;
  withdarkMode?: boolean;
}

export const TaskDueDate: React.FC<TaskDueDateProps> = ({
  dueDate,
  label = "Due Date:",
  withdarkMode = false,
}) => {
  return (
    <div
      className={`text-sm text-gray-500 ${withdarkMode ? "dark:text-gray-200" : ""}`}
    >
      {label} <span className="font-medium">{formatDate(dueDate)}</span>
    </div>
  );
};
