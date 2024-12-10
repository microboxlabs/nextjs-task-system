// stores/tasksStore.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { Task } from "@/types/taskTypes";
import { apiRequest } from "../utils/api";

interface TasksState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  getTasks: () => Promise<void>;
  createTask: (newTask: Omit<Task, "id">) => Promise<void>;
  updateTask: (id: number, updatedTask: Partial<Task>) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
}

// Helper functions to interact with the API routes
const fetchTasks = async (): Promise<Task[]> => {
  return apiRequest("/api/tasks", "GET");
};

const postTask = async (newTask: Omit<Task, "id">): Promise<Task> => {
  return apiRequest("/api/tasks", "POST", newTask);
};

const putTask = async (
  id: number,
  updatedTask: Partial<Task>,
): Promise<Task> => {
  return apiRequest(`/api/tasks?id=${id}`, "PUT", updatedTask);
};

const deleteTaskById = async (id: number): Promise<void> => {
  return apiRequest(`/api/tasks?id=${id}`, "DELETE");
};

// Zustand store for tasks
export const useTasksStore = create<TasksState>()(
  devtools((set) => ({
    tasks: [],
    loading: false,
    error: null,

    // Fetch tasks from the API and update the store
    getTasks: async () => {
      set({ loading: true, error: null });
      try {
        const tasks = await fetchTasks();
        set({ tasks, loading: false });
      } catch (err) {
        set({ error: (err as Error).message, loading: false });
      }
    },

    // Create a new task using the API and update the store
    createTask: async (newTask) => {
      set({ loading: true, error: null });
      try {
        const createdTask = await postTask(newTask);
        set((state) => ({
          tasks: [...state.tasks, createdTask],
          loading: false,
        }));
      } catch (err) {
        set({ error: (err as Error).message, loading: false });
      }
    },

    // Update an existing task using the API and update the store
    updateTask: async (id, updatedTask) => {
      set({ loading: true, error: null });
      try {
        const updated = await putTask(id, updatedTask);
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, ...updated } : task,
          ),
          loading: false,
        }));
      } catch (err) {
        set({ error: (err as Error).message, loading: false });
      }
    },

    // Delete a task using the API and update the store
    deleteTask: async (id) => {
      // Optimistic update: Remove task before API response
      set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== id),
        loading: true,
        error: null,
      }));
      try {
        await deleteTaskById(id);
      } catch (err) {
        // Revert state if API call fails
        set((state) => ({
          tasks: [...state.tasks], // Restore previous state
          error: (err as Error).message,
          loading: false,
        }));
      }
    },
  })),
);
