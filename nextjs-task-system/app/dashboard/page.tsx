"use client";

import { TaskList } from "@/components/TaskList";
import { Task } from "@/types/taskTypes";

// Datos simulados
const mockTasks: Task[] = [
  {
    id: 1,
    title: "Fix authentication bug",
    description: "Resolve issues with the login flow",
    status: "pending",
    priority: "high",
    assignedTo: "Backend Team",
    dueDate: "2024-12-15",
    comments: [],
    createdAt: "2024-12-10",
  },
  {
    id: 2,
    title: "Design new dashboard layout",
    description: "Create a responsive and modern UI for the dashboard",
    status: "inProgress",
    priority: "medium",
    assignedTo: "Frontend Team",
    dueDate: "2024-12-20",
    comments: [],
    createdAt: "2024-12-10",
  },
  {
    id: 3,
    title: "Update dependencies",
    description: "Upgrade project dependencies to the latest versions",
    status: "completed",
    priority: "low",
    assignedTo: "DevOps",
    dueDate: "2024-12-18",
    comments: [],
    createdAt: "2024-12-10",
  },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:flex-row lg:gap-6">
      {/* Pending Tasks */}
      <TaskList
        title="Pending"
        tasks={mockTasks.filter((task) => task.status === "pending")}
      />

      {/* In Progress Tasks */}
      <TaskList
        title="In Progress"
        tasks={mockTasks.filter((task) => task.status === "inProgress")}
      />

      {/* Completed Tasks */}
      <TaskList
        title="Completed"
        tasks={mockTasks.filter((task) => task.status === "completed")}
      />
    </div>
  );
}
