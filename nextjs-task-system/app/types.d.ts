export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';
export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';

export type Task = {
  id: string
  title: string
  description: string
  status: TaskStatus
  user?: { id: string, name: string }
  due_date: string
  priority: Priority
  comments?: Comment[]
}

export type User = {
    id: string;
    email: string;
    role: string;
    name: string;
}

export type Comment = {
    id: string
    comment: string
    task_id: string
    user_id: string
}