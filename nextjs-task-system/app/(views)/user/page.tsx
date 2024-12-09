"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuthStore } from "../../store/authStore";
import { useTaskStore, TaskCommentData as CommentData } from "../../store/taskStore";
import TaskCard from "../../components/tasks/TaskCard";

export default function UserPage() {
  const { user } = useAuthStore();
  const { tasks, fetchTasks, addComment, updateTask } = useTaskStore();

  const [commentContent, setCommentContent] = useState("");
  const [activeTaskId, setActiveTaskId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch tasks for the current user
  useEffect(() => {
    const fetchUserTasks = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        setError(null);

        if (user.role === "REGULAR") {
          const groupId = user.groupId || null;
          await fetchTasks(user.id, groupId?.valueOf()); // Fetch tasks for regular user
        } else if (user.role === "ADMIN") {
          await fetchTasks(undefined, undefined, true); // Admin fetches all tasks
        } else {
          setError("Invalid user role.");
        }
      } catch (err) {
        console.error("Error fetching user tasks:", err);
        setError("Failed to load user tasks. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserTasks();
  }, [user, fetchTasks]);

  // Handle adding comments to a task
  const handleAddComment = useCallback(
    async (taskId: number) => {
      if (!commentContent.trim()) {
        alert("Comment cannot be empty!");
        return;
      }

      try {
        const prismaComment = await addComment(taskId, {
          content: commentContent.trim(),
          userId: user?.id || 0,
        });

        const newComment: CommentData = {
          id: prismaComment.id,
          content: prismaComment.content,
          createdAt: prismaComment.createdAt,
          userId: user?.id || 0,
          taskId,
          user: {
            id: user?.id || 0,
            email: user?.email || "Unknown",
          },
        };

        setCommentContent("");
        setActiveTaskId(null);

        
        useTaskStore.setState((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? { ...task, comments: [...task.comments, newComment] }
              : task
          ),
        }));
      } catch (err) {
        console.error("Error adding comment:", err);
        alert("Failed to add comment. Please try again.");
      }
    },
    [commentContent, addComment, user]
  );

  
  const handleUpdateStatus = async (taskId: number, newStatus: string) => {
    if (!["PENDING", "IN_PROGRESS", "COMPLETED"].includes(newStatus)) {
      alert("Invalid status value!");
      return;
    }
  
    try {
      
      const validStatus = newStatus as "PENDING" | "IN_PROGRESS" | "COMPLETED";
  
      await updateTask(taskId, { status: validStatus });
      useTaskStore.setState((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === taskId ? { ...task, status: validStatus } : task
        ),
      }));
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update task status. Please try again.");
    }
  };

  if (!user) {
    return <p className="text-red-500">You must be logged in to view this page.</p>;
  }

  if (loading) {
    return <p>Loading tasks...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Welcome, {user.email}!</h1>
      <h2 className="mt-4 text-xl font-semibold">My Tasks</h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tasks.map((task) => (
          <TaskCard
            isRegularUser={user?.role === "REGULAR"}
            key={task.id}
            task={task}
            isActive={activeTaskId === task.id}
            onActivate={() => setActiveTaskId(task.id)}
            onAddComment={() => handleAddComment(task.id)}
            commentContent={commentContent}
            onCommentChange={setCommentContent}
            onUpdateStatus={handleUpdateStatus} // Pass the status update handler
          />
        ))}
      </div>
    </div>
  );
}
