import React from "react";

interface TaskProps {
  dueDate: string;
}

export const TaskDueDate: React.FC<TaskProps> = ({ dueDate }) => {
  const date = new Date(dueDate);

  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();
  const hours = date.getHours() % 12 || 12;
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = date.getHours() >= 12 ? "PM" : "AM";

  const formattedDate = `${month} ${day}, ${year}, ${hours}:${minutes} ${ampm}`;

  return (
    <div className="text-sm text-gray-500">
      Due Date: <span className="font-medium">{formattedDate}</span>
    </div>
  );
};
