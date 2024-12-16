"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import {
  assignTypeOptions,
  groupOptions,
  priorityOptions,
  statusOptions,
} from "@/utils/taskUtils";
import {
  Label,
  TextInput,
  Textarea,
  Select,
  Button,
  Radio,
} from "flowbite-react";
import {
  CreateTask,
  Task,
  TaskPriority,
  TaskStatus,
  UpdateTask,
} from "@/types/taskTypes";
import { useUsersStore } from "@/stores/usersStore";

interface TaskFormProps {
  task?: Task;
  onSubmit: (task: CreateTask | UpdateTask) => void;
  onDelete?: (taskId: number) => void;
  loading: boolean;
}

export function TaskForm({ task, onSubmit, onDelete, loading }: TaskFormProps) {
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [dueDate, setDueDate] = useState(task?.dueDate || "");
  const [status, setStatus] = useState<TaskStatus>(task?.status || "pending");
  const [priority, setPriority] = useState<TaskPriority>(
    task?.priority || "medium",
  );
  const [assignType, setAssignType] = useState<"user" | "group">("user");
  const [assignedToId, setAssignedToId] = useState<number>(
    task?.assignedTo?.id || 0,
  );
  const { user } = useAuthStore();
  const { users, getUsers, loading: usersLoading } = useUsersStore();
  const router = useRouter();

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    if (users.length === 0) {
      getUsers();
    }
  }, [getUsers, users.length]);

  const handleCancel = () => {
    router.push("/dashboard");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const taskValues: CreateTask = {
      title,
      description,
      status,
      dueDate,
      priority,
      assignedTo: {
        type: assignType,
        id: assignedToId,
      },
    };

    task
      ? onSubmit({ id: task.id, ...taskValues } as UpdateTask)
      : onSubmit(taskValues);
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
          disabled={loading || !isAdmin}
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
          disabled={loading || !isAdmin}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <fieldset className="flex gap-4">
          <legend className="mb-4 text-sm text-gray-900 dark:text-white">
            Assign To
          </legend>
          {assignTypeOptions.map((option) => (
            <div className="flex items-center gap-2" key={option.value}>
              <Radio
                id={option.value}
                name="assignType"
                value={option.value}
                checked={assignType === option.value}
                onChange={() => setAssignType(option.value)}
              />
              <Label htmlFor={option.value}>{option.label}</Label>
            </div>
          ))}
        </fieldset>
        <div>
          <div className="mb-2 block">
            <Label
              htmlFor="assignedToId"
              value={assignType === "user" ? "Select User" : "Select Group"}
            />
          </div>
          {assignType === "user" && (
            <Select
              id="assignedToId"
              value={assignedToId}
              onChange={(e) => setAssignedToId(Number(e.target.value))}
              disabled={loading || usersLoading || !isAdmin}
            >
              {users.map(({ id, username }) => (
                <option key={id} value={id}>
                  {username}
                </option>
              ))}
            </Select>
          )}
          {assignType === "group" && (
            <Select
              id="assignedToId"
              value={assignedToId}
              onChange={(e) => setAssignedToId(Number(e.target.value))}
              disabled={loading || !isAdmin}
            >
              {groupOptions.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
          )}
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
            disabled={loading || !isAdmin}
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
            disabled={loading || !isAdmin}
          >
            {priorityOptions.map(({ label, value }) => (
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
            {statusOptions.map(({ label, value }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
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
        {isAdmin && onDelete && (
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
