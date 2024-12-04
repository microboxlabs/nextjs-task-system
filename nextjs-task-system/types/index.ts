// types.ts
export interface User {
  id: number;
  username: string;
  password: string;
  role: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  assigned_to: number;
  due_date: string;
  priority: string;
  status: string;
  comments: string;
}

export interface Group {
  id: number;
  name: string;
}
