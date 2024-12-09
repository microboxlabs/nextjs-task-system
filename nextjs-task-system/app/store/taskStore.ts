import { create } from "zustand";
import { localStorageHelper } from "@/utils/localStorageHelper";
import { API_ROUTES } from "../../utils/apiRoutes";

export interface TaskCommentData {
  id: number;
  content: string;
  createdAt: string;
  userId: number;
  taskId: number;
  user?: {
    id: number;
    email: string;
  };
}

interface Task {
  id: number;
  title: string;
  description: string;
  assignedTo: string | null;
  priority: "Low" | "Medium" | "High";
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED"; 
  dueDate: string;
  comments: TaskCommentData[];
  user: {
    id: number;
    email: string;
    role: string;
  };
  group: {
    id: number;
    name: string;
  };
}


interface TaskStore {
  tasks: Task[];
  loading: boolean;
  error: { message: string; code?: number } | null;
  fetchTasks: (userId?: number, groupId?: number, isAdmin?: boolean) => Promise<void>;
  addTask: (task: Partial<Task>) => Promise<void>;
  updateTask: (id: number, updatedFields: Partial<Task>) => Promise<void>;

  deleteTask: (id: number) => Promise<void>;
  addComment: (
    taskId: number,
    commentData: { content: string; userId: number }
  ) => Promise<TaskCommentData>;
  filterTasks: (filters: {
    status?: "PENDING" | "IN_PROGRESS" | "COMPLETED";
    priority?: "Low" | "Medium" | "High";
  }) => Task[];
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  loading: false,
  error: null,

  fetchTasks: async (userId?: number, groupId?: number, isAdmin?: boolean) => {
    const baseUrl = "http://localhost:3000";
    const url = new URL(`${baseUrl}/api/tasks`);
  
  
    if (isAdmin) {
      url.searchParams.append("admin", "true");
    } else {
      if (userId) url.searchParams.append("userId", userId.toString());
      if (groupId) url.searchParams.append("groupId", groupId.toString());
    }
  
    try {
      const response = await fetch(url.toString(), {
        method: "GET",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
  
      if (!response.ok) {
        const errorDetail = await response.text();
        throw new Error(errorDetail || "Failed to fetch tasks.");
      }
  
      const tasks = await response.json();
      set({ tasks });
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error fetching tasks:", error);
        set({ error: { message: error.message } });
      } else {
        console.error("Unknown error:", error);
        set({ error: { message: "An unknown error occurred." } });
      }
    }
  },
  
  

  addTask: async (task) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(API_ROUTES.TASKS.BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
      });

      if (!response.ok) throw new Error("Failed to add task.");

      const newTask = await response.json();
      set((state) => ({ tasks: [...state.tasks, newTask] }));
      localStorageHelper.setItem("tasks", get().tasks);
    } catch (error: any) {
      console.error("Error adding task:", error);
      set({ error: { message: error.message } });
    } finally {
      set({ loading: false });
    }
  },

  updateTask: async (id, updatedFields) => {
    set({ loading: true, error: null });
  
    try {
      
      const { status, ...otherFields } = updatedFields;
      if (status && !["PENDING", "IN_PROGRESS", "COMPLETED"].includes(status)) {
        throw new Error(`Invalid status value: ${status}`);
      }
  
      const response = await fetch(`${API_ROUTES.TASKS.BASE}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...otherFields, ...(status && { status }) }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error updating task:", errorData);
        throw new Error(errorData.error || "Failed to update task.");
      }
  
      const updatedTask = await response.json();
  
    
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === id ? { ...task, ...updatedTask } : task
        ),
      }));
      localStorageHelper.setItem("tasks", get().tasks);
    } catch (error: any) {
      console.error("Error in updateTask:", error.message);
      set({ error: { message: error.message } });
      throw error; 
    } finally {
      set({ loading: false });
    }
  },
  
  
  
  deleteTask: async (id: number) => {
    set({ loading: true, error: null });
  
    try {
      console.log(`Attempting to delete task with ID: ${id}`);
      
      const response = await fetch(`${API_ROUTES.TASKS.BASE}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || "Failed to delete task.";
        throw new Error(errorMessage);
      }
  
    
      set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== id),
      }));
  
      console.log(`Task with ID: ${id} deleted successfully.`);
      localStorageHelper.setItem("tasks", get().tasks);
    } catch (error: any) {
      console.error(`Error deleting task with ID: ${id}`, error.message);
      set({ error: { message: error.message } });
    } finally {
      set({ loading: false });
    }
  },
  

  addComment: async (taskId, commentData): Promise<TaskCommentData> => {
    set({ loading: true, error: null });
  
    console.log("Task ID:", taskId);
    console.log("Comment Data:", commentData);
  
    try {
      if (!taskId || !commentData?.content) {
        throw new Error("Invalid taskId or comment content.");
      }
  
      const response = await fetch(API_ROUTES.COMMENTS.BASE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ taskId, ...commentData }),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error("API error response:", errorText);
        throw new Error(errorText || "Failed to add comment.");
      }
  
      const newComment = await response.json();
      console.log("New Comment:", newComment);
  
      set((state) => {
        const updatedTasks = state.tasks.map((task) =>
          task.id === taskId
            ? { ...task, comments: [...task.comments, newComment] }
            : task
        );
        return { tasks: updatedTasks };
      });
  
      return newComment;
    } catch (error: any) {
      console.error("Error adding comment:", error.message);
      set({ error: { message: error.message } });
      throw error;
    } finally {
      set({ loading: false });
    }
  },  

  filterTasks: (filters: Partial<{ status: string; priority: string }>) => {
    const allTasks = get().tasks || [];
    return allTasks.filter((task) =>
      Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        return task[key as keyof Task] === value;
      })
    );
  },
}));
