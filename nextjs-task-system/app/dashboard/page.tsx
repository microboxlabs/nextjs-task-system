"use client";

import { TaskList } from "@/components/TaskList";
import { useAuthStore, useTasksStore } from "@/stores";
import { filterTasks } from "@/utils/taskUtils";
import { useEffect } from "react";

export default function DashboardPage() {
  const { tasks, getTasks, loading, error } = useTasksStore();
  const { user } = useAuthStore();
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    if (tasks.length === 0) {
      getTasks();
    }
  }, [getTasks, tasks.length]);

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

  if (!user) {
    return (
      <p className="p-4 text-red-500 dark:text-red-400">
        User not authenticated.
      </p>
    );
  }

  // Filter tasks based on user role and assignment
  const filteredTasks = filterTasks(tasks, user, isAdmin);

  return (
    <div className="flex flex-1 flex-col gap-2 md:gap-4 lg:flex-row">
      <TaskList
        title="Pending"
        tasks={filteredTasks.filter((task) => task.status === "pending")}
      />
      <TaskList
        title="In Progress"
        tasks={filteredTasks.filter((task) => task.status === "inProgress")}
      />
      <TaskList
        title="Completed"
        tasks={filteredTasks.filter((task) => task.status === "completed")}
      />
    </div>
  );
}
