import React from "react";
import { Badge } from "flowbite-react";

export type PriorityTask = "Low" | "Medium" | "High";

interface PriorityBadgeProps {
  priority: PriorityTask;
}

const priorityColors: Record<PriorityBadgeProps["priority"], string> = {
  Low: "green",
  Medium: "yellow",
  High: "red",
};

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  return (
    <Badge color={priorityColors[priority]} size="lg">
      {priority}
    </Badge>
  );
};
