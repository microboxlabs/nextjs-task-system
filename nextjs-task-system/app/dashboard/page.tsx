"use client";

import { useState, useEffect } from "react";
import { Label, Select } from "flowbite-react";
import { TaskList } from "@/components/TaskList";
import { useAuthStore, useTasksStore } from "@/stores";
import { filterTasks, priorityOrder, sortTasks } from "@/utils/taskUtils";
import {
  priorityOptions,
  statusOptions,
  filterByStatus,
  filterByPriority,
  filterByAssigned,
  AssignedFilter,
  StatusFilter,
  PriorityFilter,
} from "@/utils/taskUtils";

export default function DashboardPage() {
  const { tasks, getTasks, loading, error } = useTasksStore();
  const { user } = useAuthStore();
  const isAdmin = user?.role === "admin";

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("all");
  const [assignedFilter, setAssignedFilter] = useState<AssignedFilter>("all");
  const [sortBy, setSortBy] = useState("dueDate");

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

  // Filter tasks based on the user's role and assignment
  let filteredTasks = filterTasks(tasks, user, isAdmin);

  // Apply filters
  filteredTasks = filterByStatus(filteredTasks, statusFilter);
  filteredTasks = filterByPriority(filteredTasks, priorityFilter);
  filteredTasks = filterByAssigned(filteredTasks, user, assignedFilter);

  // Sort tasks based on the selected criteria
  filteredTasks = sortTasks(filteredTasks, sortBy);

  return (
    <div className="flex flex-1 flex-col gap-4">
      {/* Filter section */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div>
          <Label htmlFor="status" value="Status" />
          <Select
            id="status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
          >
            <option value="all">All</option>
            {statusOptions.map(({ label, value }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="priority" value="Priority" />
          <Select
            id="priority"
            value={priorityFilter}
            onChange={(e) =>
              setPriorityFilter(e.target.value as PriorityFilter)
            }
          >
            <option value="all">All</option>
            {priorityOptions.map(({ label, value }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="assigned" value="Assigned To" />
          <Select
            id="assigned"
            value={assignedFilter}
            onChange={(e) =>
              setAssignedFilter(e.target.value as AssignedFilter)
            }
          >
            <option value="all">All</option>
            <option value="user">Me</option>
            <option value="group">My Group</option>
            <option value="both">Me or My Group</option>
          </Select>
        </div>
        {isAdmin && (
          <div>
            <Label htmlFor="sortBy" value="Sort By" />
            <Select
              id="sortBy"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="dueDate">Due Date</option>
              <option value="priority">Priority</option>
              <option value="creationDate">Creation Date</option>
            </Select>
          </div>
        )}
      </div>

      {/* Task list section */}
      <div className="flex flex-1 flex-col gap-2 md:gap-4 lg:flex-row">
        {statusFilter === "all" || statusFilter === "pending" ? (
          <div className="flex-1 md:mx-auto md:w-1/3">
            <TaskList
              title="Pending"
              tasks={filteredTasks.filter((task) => task.status === "pending")}
            />
          </div>
        ) : null}

        {statusFilter === "all" || statusFilter === "inProgress" ? (
          <div className="flex-1 md:mx-auto md:w-1/3">
            <TaskList
              title="In Progress"
              tasks={filteredTasks.filter(
                (task) => task.status === "inProgress",
              )}
            />
          </div>
        ) : null}

        {statusFilter === "all" || statusFilter === "completed" ? (
          <div className="flex-1 md:mx-auto md:w-1/3">
            <TaskList
              title="Completed"
              tasks={filteredTasks.filter(
                (task) => task.status === "completed",
              )}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
