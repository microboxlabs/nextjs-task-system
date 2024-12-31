"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useNotificationStore, useTasksStore } from "@/stores";
import { CommentsSection, TaskForm } from "@/components";
import { Task } from "@/types";
import { UpdateTaskSchema } from "@/schemas/taskSchema";

interface TaskDetailsProps {
  task: Task;
}

export const TaskDetails: React.FC<TaskDetailsProps> = ({ task }) => {
  const [comments, setComments] = useState(task.comments);
  const { addNotification } = useNotificationStore();
  const { updateTask, deleteTask, loading } = useTasksStore();
  const router = useRouter();

  const handleUpdate = async (updatedTask: UpdateTaskSchema) => {
    try {
      await updateTask({ ...updatedTask, comments });
      addNotification({
        message: "Task updated successfully.",
        type: "success",
      });
      router.refresh();
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
      await updateTask({
        ...task,
        comments: [...task.comments, comment],
      });
      setComments((prevComments) => [...prevComments, comment]);
      addNotification({
        message: "Comment added successfully.",
        type: "success",
      });
    } catch (err) {
      addNotification({
        message: "Error adding comment. Please try again.",
        type: "error",
      });
    }
  };

  return (
    <div className="flex w-full max-w-screen-xl flex-col justify-center gap-4 md:flex-row md:gap-6 lg:px-4">
      <div className="flex w-full md:max-w-sm lg:max-w-lg">
        <TaskForm
          task={task}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          loading={loading}
        />
      </div>
      <div className="flex-1">
        <CommentsSection comments={comments} onAddComment={handleAddComment} />
      </div>
    </div>
  );
};
