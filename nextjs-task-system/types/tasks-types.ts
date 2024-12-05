import { Response } from "./global-types";

enum Status {
  Pending = "Pending",
  "In Progress" = "In Progress",
  Completed = "Completed",
}

enum Priority {
  Low = "Low",
  Medium = "Medium",
  High = "High",
}
export interface Task {
  id: number;
  title: string;
  status: string | Status;
  user?: string;
  group?: string;
  dueDate: string | Date;
  priority: string | Priority;
}

export interface TaskReponse {
  id: number;
  title: string;
  status: {
    name: string;
  };
  user?: {
    name: string;
  };
  group?: {
    name: string;
  };
  dueDate: string;
  priority: {
    name: string;
  };
}
interface GroupsAndPriorities {
  id: number;
  name: string;
}

interface User {
  id: number;
  name: string;
  email: string;
}

interface SelectFormAssigned {
  groups: GroupsAndPriorities[];
  users: User[];
  priorities: GroupsAndPriorities[];
}

export interface ResponseSelectAssigned extends Response {
  data: SelectFormAssigned;
}
export interface ResponseTaskGetBackend extends Response {
  data: TaskReponse[];
}
export interface ResponseTaskGet extends Response {
  data: Task[];
}
