"use client";
import React, { createContext, useContext, useState, useCallback } from "react";
import { toast } from "sonner";
import { TaskT } from "@/db/type";
import { CreateTaskInput, UpdateTaskInput } from "@/db/z-tasks";
import { ZodError } from "zod";
import { comments } from "@/db/schema";

// Define the shape of your context data (unchanged)
interface TaskContextType {
  tasks: TaskT[];
  getTasks: () => Promise<void>;
  updateTaskPriority: (priority: string, taskId: string) => Promise<void>;
  updateTaskStatus: (status: string, taskId: string) => Promise<void>;
  updateTask: (taskId: string, values: UpdateTaskInput) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  createTask: (taskValues: CreateTaskInput) => Promise<void>;
  assignTask: (
    isUser: boolean,
    taskId: string,
    targetId: string,
  ) => Promise<void>;
  unassign: (taskId: string) => Promise<void>;
  createComment: (taskId: string, comment: string) => Promise<void>;
  getTaskComments: (taskId: string) => Promise<void>;
}

// Create the context with a default value
export const TaskContext = createContext<TaskContextType | undefined>(
  undefined,
);

// Context Provider Component
export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [tasks, setTasks] = useState<TaskT[]>([]);

  const getTasks = useCallback(async () => {
    try {
      const response = await fetch("/api/v1/tasks");
      const data = await response.json();
      if (response.ok) {
        setTasks(data.tasks);
      }
    } catch (error) {
      throw error;
    }
  }, []);

  const updateTaskPriority = useCallback(
    async (priority: string, taskId: string) => {
      try {
        const response = await fetch(`/api/v1/tasks/${taskId}`, {
          method: "PATCH",
          body: JSON.stringify({ priority }),
          headers: {
            "Content-type": "application/json",
          },
        });
        if (!response.ok) throw new Error("Unexpected error");

        const data = await response.json();

        setTasks((prev) =>
          prev.map((task) =>
            task.id === taskId ? (data.task as TaskT) : task,
          ),
        );
        toast.success("Status updated successfully");
      } catch (error) {
        console.error(error);
        toast.error("There has been an error, please try again later");
      }
    },
    [],
  );

  const updateTaskStatus = useCallback(
    async (status: string, taskId: string) => {
      try {
        const response = await fetch(`/api/v1/tasks/${taskId}`, {
          method: "PATCH",
          body: JSON.stringify({ status }),
          headers: {
            "Content-type": "application/json",
          },
        });
        if (!response.ok) throw new Error("Unexpected error");

        const data = await response.json();
        if (data.task.status === "ARCHIVED") {
          // should be removed from the DOM
          setTasks((prev) => prev.filter((task) => task.id !== taskId));
          toast.success("Task has been archived correctly");
          return;
        }
        setTasks((prev) =>
          prev.map((task) =>
            task.id === taskId ? (data.task as TaskT) : task,
          ),
        );
        toast.success("Status updated successfully");
      } catch (error) {
        console.error(error);
        toast.error("There has been an error, please try again later");
      }
    },
    [],
  );

  const updateTask = useCallback(
    async (taskId: string, values: UpdateTaskInput) => {
      try {
        const response = await fetch("/api/v1/tasks/" + taskId, {
          method: "PUT",
          body: JSON.stringify(values),
          headers: {
            "Content-type": "application/json",
          },
        });
        const data = await response.json();
        if (!response.ok) {
          if (data.error) {
            toast.error("There has been an error");
          }
          return;
        }
        if (data.task) {
          setTasks((prev) =>
            prev.map((task) => (task.id === taskId ? data.task : task)),
          );
          toast.success("Task updated successfully");
        }
        return;
      } catch (error) {
        console.log(error);
        if (error instanceof ZodError) {
          toast.error(error.errors[0].message);
          return;
        }
        toast.error("There has been an error");
      }
    },
    [],
  );

  const deleteTask = useCallback(async (taskId: string) => {
    try {
      const response = await fetch("/api/v1/tasks/" + taskId, {
        method: "DELETE",
      });
      const data = response.json();
      if (!response.ok) throw new Error("Unexpected");
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
      toast.success("Task deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("There has been an error");
    }
  }, []);

  const createTask = useCallback(async (taskData: CreateTaskInput) => {
    try {
      const response = await fetch("/api/v1/tasks", {
        method: "POST",
        body: JSON.stringify(taskData),
        headers: {
          "Content-type": "application/json",
        },
      });
      const data = await response.json();
      if (!response.ok) {
        if (data.error && data.message) {
          toast.error(data.error, {
            description: data.message,
          });
        } else {
          toast.error("Something went wrong");
        }
        return;
      }
      setTasks((prev) => [...prev, data.task]);
    } catch (error) {
      console.error(error);
      toast.error("There has been an error");
    }
  }, []);

  const assignTask = useCallback(
    async (isUser: boolean, taskId: string, targetId: string) => {
      try {
        const response = await fetch(`/api/v1/tasks/${taskId}/assign`, {
          method: "PATCH",
          body: JSON.stringify({
            targetId,
            isUser: isUser,
          }),
          headers: {
            "Content-type": "application/json",
          },
        });

        if (!response.ok) {
          toast.error("there has been a server error");
          return;
        }

        const data = await response.json();

        setTasks((prev) =>
          prev.map((task) => (task.id === taskId ? data.task : task)),
        );
      } catch (error) {
        console.error(error);
        toast.error("There has been an error assigning the task");
      }
    },
    [],
  );

  const unassign = useCallback(async (taskId: string) => {
    try {
      const response = await fetch(`/api/v1/tasks/${taskId}/assign`, {
        method: "DELETE",
      });
      if (!response) {
        toast.error("There was an error unassigned");
        return;
      }

      const data = await response.json();
      setTasks((prev) =>
        prev.map((task) => (task.id === taskId ? data.task : task)),
      );
      toast.success("Task unassigned successfully");
    } catch (error) {
      console.error(error);
      toast.error("There has been an error unassigned");
    }
  }, []);

  const createComment = useCallback(async (taskId: string, comment: string) => {
    try {
      const response = await fetch(`/api/v1/tasks/${taskId}/comments`, {
        method: "POST",
        body: JSON.stringify({ comment }),
        headers: {
          "Content-type": "application/json",
        },
      });
      if (!response.ok) {
        toast.error("There has been an error");
        return;
      }
      const data = await response.json();
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId
            ? {
                ...task,
                id: task.id, // force re-render
                comments: task.comments
                  ? [data.comment, ...task.comments] // extend already existing comments
                  : [data.comment], // create the comments array with the new comment
              }
            : task,
        ),
      );
      toast.success("Comment created successfully");
    } catch (error) {
      console.error(error);
      toast.error("There has been an error creating the comment");
    }
  }, []);

  const getTaskComments = useCallback(async (taskId: string) => {
    try {
      const response = await fetch(`/api/v1/tasks/${taskId}/comments`);
      if (!response.ok) throw new Error("Unknown error");
      const data = await response.json();
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId
            ? { ...task, id: task.id, comments: data.comments }
            : task,
        ),
      );
    } catch (error) {
      console.error(error);
      // Do we want to throw an error?
    }
  }, []);

  // Create context value
  const contextValue = {
    tasks,
    getTasks,
    updateTaskPriority,
    updateTaskStatus,
    updateTask,
    deleteTask,
    createTask,
    assignTask,
    unassign,
    createComment,
    getTaskComments,
  };

  return (
    <TaskContext.Provider value={contextValue}>{children}</TaskContext.Provider>
  );
};

// Custom hook for using the context (unchanged)
export const useTaskContext = () => {
  const context = useContext(TaskContext);

  if (context === undefined) {
    throw new Error("useTaskContext must be used within a TaskProvider");
  }

  return context;
};
