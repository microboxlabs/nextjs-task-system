import React from "react";
import { TaskCard } from "./TaskCard";
import { Task } from "@/app/lib/definitions";

interface TaskGroupProps {
  title: string;
  tasks: Task[];
  onTaskUpdate: (updatedTask: Task) => void;
}

export function TaskGroup({ title, tasks, onTaskUpdate }: TaskGroupProps) {
  return (
    <div>
      <h2 className="mb-4 text-xl font-semibold text-gray-700">{title}</h2>
      <div className="space-y-4">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onStatusChange={onTaskUpdate} />
        ))}
      </div>
    </div>
  );
}
