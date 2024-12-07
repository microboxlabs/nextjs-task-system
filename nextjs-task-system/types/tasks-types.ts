import { Response } from "./global-types";

interface Comments {
  content: string;
  user: RelationResponse;
}
export interface RelationResponse {
  id: number;
  name: string;
}
export interface Task {
  id: number;
  title: string;
  description: string;
  status: RelationResponse;
  user?: RelationResponse | null;
  group?: RelationResponse | null;
  creationDate: string | Date;
  dueDate: string | Date;
  priority: RelationResponse;
  comments?: Comments[];
}

export interface TaskReponse {
  id: number;
  title: string;
  status: {
    id: number;
    name: string;
  };
  user?: {
    id: number;
    name: string;
  };
  group?: {
    id: number;
    name: string;
  };
  dueDate: string;
  priority: {
    id: number;
    name: string;
  };
}
export interface GroupsAndPriorities {
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
  status: GroupsAndPriorities[];
}

export interface ResponseSelectAssigned extends Response {
  data: SelectFormAssigned | undefined;
}
export interface ResponseTaskGetBackend extends Response {
  data: TaskReponse[];
}
export interface ResponseTaskGet extends Response {
  data: Task[];
}

export interface ResponseTaskGetWithoutArray extends Response {
  data: Task;
}

export interface Filters {
  status: string[];
  priority: string;
  assignedUserOrGroup: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
  typeOfAssigned: string;
}

export interface FormatedFilters {
  status: number[];
  priority: number;
  assignedUserOrGroup: number;
  sortBy: string;
  sortOrder: "asc" | "desc";
  typeOfAssigned: string;
}
