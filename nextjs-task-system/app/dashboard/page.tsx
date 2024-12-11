"use client";

import { TaskList } from "@/components/TaskList";
import { useTasksStore } from "@/stores/tasksStore";
import { useEffect } from "react";

export default function DashboardPage() {
  const { tasks, getTasks, loading, error } = useTasksStore();

  useEffect(() => {
    getTasks();
  }, [getTasks]);

  if (loading) {
    return (
      <p className="p-4 text-gray-600 dark:text-gray-400">Loading tasks...</p>
    );
  }

  if (error) {
    return (
      <p className="p-4 text-red-500 dark:text-red-400">
        Failed to load tasks: {error}
      </p>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-2 md:gap-4 lg:flex-row">
      {/* Pending Tasks */}
      <TaskList
        title="Pending"
        tasks={tasks.filter((task) => task.status === "pending")}
      />

      {/* In Progress Tasks */}
      <TaskList
        title="In Progress"
        tasks={tasks.filter((task) => task.status === "inProgress")}
      />

      {/* Completed Tasks */}
      <TaskList
        title="Completed"
        tasks={tasks.filter((task) => task.status === "completed")}
      />
    </div>
  );
}
