export type Task = {
  id: number;
  title: string;
  description: string;
  assigned_to: string;
  due_date: string;
  priority: string;
  status: string;
  comments?: string;
};
