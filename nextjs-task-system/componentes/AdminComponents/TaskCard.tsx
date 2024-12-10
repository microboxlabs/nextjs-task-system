import React from "react";
import { Card, Button } from "flowbite-react";

type Task = {
  id: number;
  title: string;
  description: string;
  assigned_to: number;
  due_date: string;
  priority: string;
  status: string;
  comments?: string;
};

type TaskCardProps = {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
};

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete }) => {
  return (
    <Card key={task.id}>
      <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        {task.title}
      </h5>
      <p className="font-normal text-gray-700 dark:text-gray-400">
        {task.description}
      </p>
      <p>
        <strong>Assigned to:</strong> {task.assigned_to}
      </p>
      <p>
        <strong>Due Date:</strong> {task.due_date}
      </p>
      <p>
        <strong>Priority:</strong> {task.priority}
      </p>
      <p>
        <strong>Status:</strong> {task.status}
      </p>
      {task.comments && (
        <p>
          <strong>Comments:</strong> {task.comments}
        </p>
      )}
      <div className="mt-4 flex justify-end space-x-2">
        <Button color="warning" onClick={() => onEdit(task)}>
          Edit
        </Button>
        <Button color="failure" onClick={() => onDelete(task)}>
          Delete
        </Button>
      </div>
    </Card>
  );
};

export default TaskCard;
