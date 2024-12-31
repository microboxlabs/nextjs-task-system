// taskUtils.js

import { User } from "@/types";
import { AssignedTo, Task, TaskPriority, TaskStatus } from "@/types/taskTypes";

export type AssignedFilter = "all" | "user" | "group" | "both";
export type StatusFilter = "all" | TaskStatus;
export type PriorityFilter = "all" | TaskPriority;

export const priorityOptions: { label: string; value: TaskPriority }[] = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
];

export const statusOptions: { label: string; value: TaskStatus }[] = [
  { label: "Pending", value: "pending" },
  { label: "In Progress", value: "inProgress" },
  { label: "Completed", value: "completed" },
];

export const assignTypeOptions: { label: string; value: "user" | "group" }[] = [
  { label: "User", value: "user" },
  { label: "Group", value: "group" },
];

export const groupOptions: { label: string; value: number }[] = [
  { label: "Admin Team", value: 1 },
  { label: "Frontend Team", value: 2 },
  { label: "Backend Team", value: 3 },
];

export const priorityOrder = {
  low: 3,
  medium: 2,
  high: 1,
};

// Function to get the name of the assigned user or group based on the assignedTo object
export const getAssignedName = (assignedTo: AssignedTo, users: User[]) => {
  if (assignedTo.type === "user") {
    const assignedUser = users.find((u) => u.id === assignedTo.id);
    return assignedUser ? assignedUser.username : "Unknown User";
  } else if (assignedTo.type === "group") {
    const assignedGroup = groupOptions.find((g) => g.value === assignedTo.id);
    return assignedGroup ? assignedGroup.label : "Unknown Group";
  }
  return "Unassigned";
};

// Function to filter tasks based on the user's role and assignment
export const filterTasks = (tasks: Task[], user: User, isAdmin: boolean) => {
  return isAdmin
    ? tasks
    : tasks.filter(
        (task: Task) =>
          task.assignedTo &&
          ((task.assignedTo.type === "user" &&
            task.assignedTo.id === user.id) ||
            (task.assignedTo.type === "group" &&
              task.assignedTo.id === user.group.id)),
      );
};

// Function to filter tasks by their status
export const filterByStatus = (tasks: Task[], status: StatusFilter) => {
  if (status === "all") return tasks;
  return tasks.filter((task) => task.status === status);
};

// Function to filter tasks by their priority
export const filterByPriority = (tasks: Task[], priority: PriorityFilter) => {
  if (priority === "all") return tasks;
  return tasks.filter((task) => task.priority === priority);
};

// Function to filter tasks based on the assigned user or group
export const filterByAssigned = (
  tasks: Task[],
  user: User,
  assignedFilter: AssignedFilter,
) => {
  if (assignedFilter === "all") return tasks;

  return tasks.filter((task) => {
    if (task.assignedTo) {
      if (assignedFilter === "user") {
        return (
          task.assignedTo.type === "user" && task.assignedTo.id === user.id
        );
      }
      if (assignedFilter === "group") {
        return (
          task.assignedTo.type === "group" &&
          task.assignedTo.id === user.group.id
        );
      }
      if (assignedFilter === "both") {
        return (
          (task.assignedTo.type === "user" && task.assignedTo.id === user.id) ||
          (task.assignedTo.type === "group" &&
            task.assignedTo.id === user.group.id)
        );
      }
    }
    return false;
  });
};

// Function to sort tasks based on the specified criteria
export const sortTasks = (tasks: Task[], sortBy: string) => {
  return tasks.sort((a, b) => {
    if (sortBy === "dueDate") {
      const dateA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
      const dateB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
      return dateA - dateB;
    } else if (sortBy === "priority") {
      return (
        (priorityOrder[a.priority] || 0) - (priorityOrder[b.priority] || 0)
      );
    } else if (sortBy === "creationDate") {
      const createdAtA = a.createdAt
        ? new Date(a.createdAt).getTime()
        : Infinity;
      const createdAtB = b.createdAt
        ? new Date(b.createdAt).getTime()
        : Infinity;
      return createdAtA - createdAtB;
    }
    return 0;
  });
};
