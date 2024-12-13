"use client";

import { useState } from "react";
import { CommentsSection } from "@/components/CommentsSection";
import { TaskForm } from "@/components/TaskForm";
import { useTasksStore } from "@/stores/tasksStore";
import { Task } from "@/types";
import { Toast } from "flowbite-react";
import { HiX, HiCheck } from "react-icons/hi";

interface TaskDetailsProps {
  task: Task;
}

export const TaskDetails: React.FC<TaskDetailsProps> = ({ task }) => {
  const { updateTask, deleteTask, loading, error } = useTasksStore();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const handleUpdate = async (updatedTask: Task) => {
    try {
      await updateTask(task.id, updatedTask);
      setToastMessage("Task updated successfully.");
      setShowToast(true);
    } catch (err) {
      setToastMessage(error || "Error updating task. Please try again.");
      setShowToast(true);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTask(task.id);
      setToastMessage("Task deleted successfully.");
      setShowToast(true);
    } catch (err) {
      setToastMessage(error || "Error deleting task. Please try again.");
      setShowToast(true);
    }
  };

  const handleAddComment = async (comment: string) => {
    try {
      await updateTask(task.id, {
        ...task,
        comments: [...task.comments, comment],
      });
    } catch (err) {
      setToastMessage(error || "Error adding comment. Please try again.");
      setShowToast(true);
    }
  };

  return (
    <div className="flex w-full max-w-screen-xl flex-col  justify-center md:flex-row md:gap-6 lg:px-4">
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
      <div className="flex w-full max-w-lg">
        <TaskForm
          task={task}
          onSubmit={handleUpdate}
          onDelete={handleDelete}
          loading={loading}
        />
      </div>
      <div className="flex-1">
        <CommentsSection
          comments={task.comments}
          onAddComment={handleAddComment}
        />
      </div>
    </div>
  );
};
