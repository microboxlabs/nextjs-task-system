// types.ts
export interface User {
  id?: number;
  username: string;
  password: string;
  role: string;
}

export interface Task {
  id?: number;
  title: string;
  description: string;
  assigned_to: number | { type: string; id: number }; // Usuario o grupo asignado
  due_date: string;
  priority: string;
  status?: string;
  comments?: string;
  assigned_user?: string; // Nombre del usuario asignado (si aplica)
  assigned_group?: string; // Nombre del grupo asignado (si aplica)
}

export interface Group {
  id?: number;
  name: string;
  user_ids?: number[];
}
