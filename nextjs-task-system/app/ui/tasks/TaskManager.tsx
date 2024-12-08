"use client";

import { useState } from "react";
import { TaskList } from "./TaskList";
import { Task } from "../../lib/definitions";

interface TaskManagerProps {
  initialTasks: Task[];
}

export default function TaskManager({ initialTasks }: TaskManagerProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const handleTaskUpdate = (updatedTask: Task) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task,
      ),
    );
  };

  return (
    <main className="mx-auto max-w-7xl p-4">
      <h1 className="mb-4 text-2xl font-bold">Task Manager</h1>
      <TaskList tasks={tasks} onTaskUpdate={handleTaskUpdate} />
    </main>
  );
}
