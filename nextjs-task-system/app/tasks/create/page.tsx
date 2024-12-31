"use client";

import { useRouter } from "next/navigation";
import { useNotificationStore, useTasksStore } from "@/stores";
import { TaskForm } from "@/components/TaskForm";
import { CreateTaskSchema } from "@/schemas/taskSchema";

export default function CreateTaskPage() {
  const { addNotification } = useNotificationStore();
  const { createTask, loading } = useTasksStore();
  const router = useRouter();

  const handleSubmit = async (task: CreateTaskSchema) => {
    try {
      await createTask(task);
      addNotification({
        message: "Task created successfully.",
        type: "success",
      });
      router.push("/dashboard");
    } catch (err) {
      addNotification({
        message: "Error creating task. Please try again.",
        type: "error",
      });
    }
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-center p-2 md:p-4">
      <div className="w-full max-w-md">
        <h2 className="mb-2 text-2xl font-semibold text-gray-900 dark:text-white md:mb-4">
          Create Task
        </h2>
        <TaskForm onCreate={handleSubmit} loading={loading} />
      </div>
    </div>
  );
}
