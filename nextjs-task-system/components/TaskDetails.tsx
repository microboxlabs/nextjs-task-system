"use client";

import { useRouter } from "next/navigation";
import { useNotificationStore, useTasksStore } from "@/stores";
import { CommentsSection, TaskForm } from "@/components";
import { Task } from "@/types";

interface TaskDetailsProps {
  task: Task;
}

export const TaskDetails: React.FC<TaskDetailsProps> = ({ task }) => {
  const { addNotification } = useNotificationStore();
  const { updateTask, deleteTask, loading, error } = useTasksStore();
  const router = useRouter();

  const handleUpdate = async (updatedTask: Task) => {
    try {
      await updateTask(task.id, updatedTask);
      addNotification({
        message: "Task updated successfully.",
        type: "success",
      });
    } catch (err) {
      addNotification({
        message: "Error updating task. Please try again.",
        type: "error",
      });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTask(task.id);
      addNotification({
        message: "Task deleted successfully.",
        type: "success",
      });
      router.push("/dashboard");
    } catch (err) {
      addNotification({
        message: "Error deleting task. Please try again.",
        type: "error",
      });
    }
  };

  const handleAddComment = async (comment: string) => {
    try {
      await updateTask(task.id, {
        ...task,
        comments: [...task.comments, comment],
      });
    } catch (err) {
      addNotification({
        message: "Error adding comment. Please try again.",
        type: "error",
      });
    }
  };

  return (
    <div className="flex w-full max-w-screen-xl flex-col  justify-center md:flex-row md:gap-6 lg:px-4">
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
