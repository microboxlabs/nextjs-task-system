"use client";

import { useState } from "react";
import { TaskList } from "./TaskList";
import { Task } from "../../lib/definitions";

interface TaskManagerProps {
  initialTasks: Task[];
  currentUser: string;
  userGroups: string[];
}

export default function TaskManager({
  initialTasks,
  currentUser,
  userGroups,
}: TaskManagerProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [filters, setFilters] = useState({ priority: "", assignedTo: "" });

  const handleTaskUpdate = (updatedTask: Task) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task,
      ),
    );
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prevFilters) => ({ ...prevFilters, [key]: value }));
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesPriority =
      filters.priority === "" || task.priority === filters.priority;

    const matchesAssignedTo =
      (filters.assignedTo === "mine" && task.assignedTo.id === currentUser) || // Tareas asignadas al usuario
      (filters.assignedTo === "group" &&
        userGroups.includes(task.assignedTo.id)) || // Tareas asignadas a un grupo del usuario
      filters.assignedTo === ""; // Mostrar todas las tareas si no hay filtro

    return matchesPriority && matchesAssignedTo;
  });

  return (
    <main className="mx-auto max-w-7xl p-4">
      <h1 className="mb-4 text-2xl font-bold">Task Manager</h1>

      {/* Filtros */}
      <div className="mb-6 flex space-x-4">
        <select
          className="rounded border p-2"
          onChange={(e) => handleFilterChange("priority", e.target.value)}
          value={filters.priority}
        >
          <option value="">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <select
          className="rounded border p-2"
          onChange={(e) => handleFilterChange("assignedTo", e.target.value)}
          value={filters.assignedTo}
        >
          <option value="">All Tasks</option>
          <option value="mine">My Tasks</option>
          <option value="group">Group Tasks</option>
        </select>
      </div>

      <TaskList tasks={filteredTasks} onTaskUpdate={handleTaskUpdate} />
    </main>
  );
}
