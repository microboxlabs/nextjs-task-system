"use client";

import { useState } from "react";
import { useTasksStore } from "@/stores/tasksStore";
import { TaskForm } from "@/components/TaskForm";
import { Task } from "@/types/taskTypes";
import { useRouter } from "next/navigation";
import { Toast } from "flowbite-react";
import { HiCheck, HiX } from "react-icons/hi";

export default function CreateTaskPage() {
  const { createTask, loading, error } = useTasksStore();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (task: Task) => {
    try {
      await createTask(task);
      setToastMessage("Task created successfully.");
      setShowToast(true);
      router.push("/dashboard");
    } catch (err) {
      setToastMessage(error || "Error creating task. Please try again.");
      setShowToast(true);
    }
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-center p-2 md:p-4">
      <div className="w-full max-w-md">
        <h2 className="mb-2 text-2xl font-semibold text-gray-900 dark:text-white md:mb-4">
          Create Task
        </h2>
        <TaskForm onSubmit={handleSubmit} loading={loading} />
      </div>
      {showToast && (
        <Toast className="fixed bottom-5 right-5">
          <div
            className={`inline-flex size-8 shrink-0 items-center justify-center rounded-lg ${
              error
                ? "bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200"
                : "bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200"
            }`}
          >
            {error ? (
              <HiX className="size-5" />
            ) : (
              <HiCheck className="size-5" />
            )}
          </div>
          <div className="ml-3 text-sm font-normal">{toastMessage}</div>
          <Toast.Toggle onDismiss={() => setShowToast(false)} />
        </Toast>
      )}
    </div>
  );
}
