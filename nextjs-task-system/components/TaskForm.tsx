"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createTaskSchema,
  CreateTaskSchema,
  TaskStatusType,
  updateTaskSchema,
  UpdateTaskSchema,
} from "@/schemas/taskSchema";
import { useAuthStore, useUsersStore } from "@/stores";
import {
  assignTypeOptions,
  groupOptions,
  priorityOptions,
  statusOptions,
} from "@/utils/taskUtils";
import { Task, TaskPriority } from "@/types/taskTypes";
import {
  Label,
  TextInput,
  Textarea,
  Select,
  Button,
  Radio,
} from "flowbite-react";

export interface TaskFormProps {
  task?: Task;
  onCreate?: (newTask: CreateTaskSchema) => void;
  onUpdate?: (updatedTask: UpdateTaskSchema) => void;
  onDelete?: (taskId: number) => void;
  loading: boolean;
}

export function TaskForm({
  task,
  onCreate,
  onUpdate,
  onDelete,
  loading,
}: TaskFormProps) {
  const { control, handleSubmit, setValue, formState, watch } = useForm({
    defaultValues: {
      id: task?.id || undefined,
      title: task?.title || "",
      description: task?.description || "",
      dueDate: task?.dueDate || undefined,
      status: task ? (task.status as TaskStatusType) : "pending",
      priority: task ? (task.priority as TaskPriority) : "medium",
      assignedTo: task?.assignedTo || null,
      comments: task?.comments || [],
    },
    resolver: zodResolver(task ? updateTaskSchema : createTaskSchema),
    mode: "onChange",
  });

  const assignedToType = watch("assignedTo.type");

  const { errors } = formState;
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

  const handleFormSubmit = async (
    data: CreateTaskSchema | UpdateTaskSchema,
  ) => {
    if (onCreate) {
      onCreate(data as CreateTaskSchema);
    }

    if (onUpdate && task) {
      onUpdate(data as UpdateTaskSchema);
    }
  };

  const handleDelete = () => {
    if (onDelete && task?.id) {
      onDelete(task.id);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="flex w-full flex-col gap-2 md:gap-4"
    >
      <div>
        <div className="mb-2 block">
          <Label htmlFor="title" value="Title" />
        </div>
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <TextInput
              id="title"
              {...field}
              disabled={loading || !isAdmin}
              color={errors.title ? "failure" : undefined}
              helperText={errors.title?.message}
            />
          )}
        />
      </div>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="description" value="Description" />
        </div>
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <Textarea
              id="description"
              {...field}
              disabled={loading || !isAdmin}
              color={errors.description ? "failure" : undefined}
              helperText={errors.description?.message}
            />
          )}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <fieldset className="flex items-baseline gap-4">
          <legend className="mb-4 text-sm text-gray-900 dark:text-white">
            Assign To
          </legend>
          {assignTypeOptions.map((option) => (
            <Controller
              key={option.value}
              name="assignedTo.type"
              control={control}
              render={({ field }) => (
                <div className="flex items-center gap-2">
                  <Radio
                    id={option.value}
                    value={option.value}
                    checked={field.value === option.value}
                    onChange={() => setValue("assignedTo.type", option.value)}
                    disabled={loading || !isAdmin}
                  />
                  <Label htmlFor={option.value}>{option.label}</Label>
                </div>
              )}
            />
          ))}
        </fieldset>
        <div>
          <div className="mb-2 block">
            <Label
              htmlFor="assignedTo.id"
              value={assignedToType === "user" ? "Select User" : "Select Group"}
            />
          </div>
          <Controller
            name="assignedTo.id"
            control={control}
            render={({ field }) => (
              <Select
                id="assignedTo.id"
                {...field}
                value={field.value ?? ""}
                onChange={(e) => {
                  const value = e.target.value;
                  setValue("assignedTo.id", value ? Number(value) : null);
                }}
                disabled={
                  loading || usersLoading || !isAdmin || !assignedToType
                }
                color={
                  errors.assignedTo?.id || errors.assignedTo
                    ? "failure"
                    : undefined
                }
                helperText={
                  errors.assignedTo?.id?.message || errors.assignedTo
                    ? "Please select an option"
                    : undefined
                }
              >
                <option value="" disabled>
                  Select an option
                </option>
                {assignedToType === "user" &&
                  users.map(({ id, username }) => (
                    <option key={id} value={Number(id)}>
                      {username}
                    </option>
                  ))}
                {assignedToType === "group" &&
                  groupOptions.map(({ value, label }) => (
                    <option key={value} value={Number(value)}>
                      {label}
                    </option>
                  ))}
              </Select>
            )}
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="dueDate" value="Due Date" />
          </div>
          <Controller
            name="dueDate"
            control={control}
            render={({ field }) => (
              <TextInput
                id="dueDate"
                type="date"
                {...field}
                disabled={loading || !isAdmin}
                color={errors.dueDate ? "failure" : undefined}
                helperText={errors.dueDate?.message}
              />
            )}
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="priority" value="Priority" />
          </div>
          <Controller
            name="priority"
            control={control}
            render={({ field }) => (
              <Select id="priority" {...field} disabled={loading || !isAdmin}>
                <option value="" disabled>
                  Select an option
                </option>
                {priorityOptions.map(({ label, value }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
            )}
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="status" value="Status" />
          </div>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select id="status" {...field} disabled={loading}>
                {statusOptions.map(({ label, value }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
            )}
          />
        </div>
      </div>
      <div className={`mt-4 flex flex-col gap-4 md:flex-row`}>
        <div
          className={`flex w-full ${
            isAdmin && onDelete ? "md:w-2/3" : "md:w-full"
          } gap-4`}
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
