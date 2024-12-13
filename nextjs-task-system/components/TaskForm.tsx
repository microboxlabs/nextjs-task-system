"use client";

import { useState } from "react";
import { Label, TextInput, Textarea, Select, Button } from "flowbite-react";
import { Task, TaskPriority, TaskStatus } from "@/types/taskTypes";
import { priorityOptions } from "@/utils/taskConstants";
import { useRouter } from "next/navigation";

interface TaskFormProps {
  task?: Task;
  onSubmit: (task: Task) => void;
  onDelete?: (taskId: number) => void;
  loading: boolean;
}

export function TaskForm({ task, onSubmit, onDelete, loading }: TaskFormProps) {
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [assignedTo, setAssignedTo] = useState(task?.assignedTo || "");
  const [dueDate, setDueDate] = useState(task?.dueDate || "");
  const [priority, setPriority] = useState<TaskPriority>(
    task?.priority || "medium",
  );
  const [status, setStatus] = useState<TaskStatus>(task?.status || "pending");
  const router = useRouter();

  const handleCancel = () => {
    router.push("/dashboard");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newTask: Omit<Task, "id"> = {
      title,
      description,
      assignedTo,
      dueDate,
      priority,
      status,
      comments: [],
    };

    if (task) {
      const updatedTask: Task = { id: task.id, ...newTask };
      onSubmit(updatedTask as Task);
    } else {
      onSubmit(newTask as Task);
    }
  };

  const handleDelete = () => {
    if (onDelete && task?.id) {
      onDelete(task.id);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full flex-col gap-2 md:gap-4"
    >
      <div>
        <div className="mb-2 block">
          <Label htmlFor="title" value="Title" />
        </div>
        <TextInput
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={loading}
        />
      </div>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="description" value="Description" />
        </div>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={loading}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <div className="mb-2 block">
            <Label htmlFor="assignedTo" value="Assigned To" />
          </div>
          <TextInput
            id="assignedTo"
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            disabled={loading}
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="dueDate" value="Due Date" />
          </div>
          <TextInput
            id="dueDate"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            disabled={loading}
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="priority" value="Priority" />
          </div>
          <Select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as TaskPriority)}
            disabled={loading}
          >
            {Object.values(priorityOptions).map(({ label, value }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="status" value="Status" />
          </div>
          <Select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as TaskStatus)}
            disabled={loading}
          >
            <option value="pending">Pending</option>
            <option value="inProgress">In Progress</option>
            <option value="completed">Completed</option>
          </Select>
        </div>
      </div>
      <div className={`mt-4 flex flex-col gap-4 md:flex-row`}>
        <div
          className={`flex w-full ${onDelete ? "md:w-2/3" : "md:w-full"} gap-4`}
        >
          <Button
            color="gray"
            onClick={handleCancel}
            disabled={loading}
            className="w-1/2 md:w-full"
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading} className="w-1/2 md:w-full">
            Save
          </Button>
        </div>
        {onDelete && (
          <div className="w-full md:w-1/3">
            <Button
              color="failure"
              onClick={handleDelete}
              disabled={loading}
              className="w-full"
            >
              Delete
            </Button>
          </div>
        )}
      </div>
    </form>
  );
}
