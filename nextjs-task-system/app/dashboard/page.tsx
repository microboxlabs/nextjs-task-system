"use client";

import TaskList from "@/components/TaskList";

export default function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:flex-row md:gap-6">
      <TaskList title="Pending" />
      <TaskList title="In Progress" />
      <TaskList title="Completed" />
    </div>
  );
}
