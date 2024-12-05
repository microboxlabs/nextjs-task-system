import { Response } from "./global-types";

interface Status {
  id: number;
  name: string;
}

export interface relationResponse {
  id: number;
  name: string;
}
export interface Task {
  id: number;
  title: string;
  description: string;
  status: relationResponse;
  user?: relationResponse | null;
  group?: relationResponse | null;
  dueDate: string | Date;
  priority: relationResponse;
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
  data: SelectFormAssigned | undefined;
}
export interface ResponseTaskGetBackend extends Response {
  data: TaskReponse[];
}
export interface ResponseTaskGet extends Response {
  data: Task[];
}
