"use client";

import { TaskList } from "@/components/TaskList";
import { useTasksStore } from "@/stores/tasksStore";
import { useAuthStore } from "@/stores/authStore";
import { useEffect } from "react";

export default function DashboardPage() {
  const { tasks, getTasks, loading, error } = useTasksStore();
  const { user } = useAuthStore();
  const isAdmin = user?.role === "admin";

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

  if (!user) {
    return (
      <p className="p-4 text-red-500 dark:text-red-400">
        User not authenticated.
      </p>
    );
  }

  // Filter tasks based on user role and assignment
  // If the user is an admin, all tasks are returned.
  // If the user is not an admin, only tasks assigned to the user or their group are returned.
  const filteredTasks = isAdmin
    ? tasks
    : tasks.filter(
        (task) =>
          task.assignedTo &&
          ((task.assignedTo.type === "user" &&
            task.assignedTo.id === user.id) ||
            (task.assignedTo.type === "group" &&
              task.assignedTo.id === user.group.id)),
      );

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
