import React from "react";
import { TaskGroup } from "./TaskGroup";
import { Task } from "@/app/lib/definitions";

interface TaskListProps {
  tasks: Task[];
  onTaskUpdate: (updatedTask: Task) => void;
}
export function TaskList({ tasks, onTaskUpdate }: TaskListProps) {
  const pendingTasks = tasks.filter((task) => task.status === "pending");
  const inProgressTasks = tasks.filter((task) => task.status === "in progress");
  const completedTasks = tasks.filter((task) => task.status === "completed");

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <TaskGroup
        title="Pending"
        tasks={pendingTasks}
        onTaskUpdate={onTaskUpdate}
      />
      <TaskGroup
        title="In Progress"
        tasks={inProgressTasks}
        onTaskUpdate={onTaskUpdate}
      />
      <TaskGroup
        title="Completed"
        tasks={completedTasks}
        onTaskUpdate={onTaskUpdate}
      />
    </div>
  );
}
