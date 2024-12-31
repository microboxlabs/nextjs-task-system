// stores/tasksStore.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { Task } from "@/types";
import { apiRequest } from "../utils/apiUtils";
import { CreateTaskSchema, UpdateTaskSchema } from "@/schemas/taskSchema";

interface TasksState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  getTasks: () => Promise<void>;
  createTask: (newTask: CreateTaskSchema) => Promise<void>;
  updateTask: (updatedTask: UpdateTaskSchema) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
}

// Helper functions to interact with the API routes
const fetchTasks = async (): Promise<Task[]> => {
  return apiRequest({ url: "/api/tasks", method: "GET" });
};

const postTask = async (newTask: CreateTaskSchema): Promise<Task> => {
  return apiRequest({ url: "/api/tasks", method: "POST", body: newTask });
};

const putTask = async (updatedTask: UpdateTaskSchema): Promise<Task> => {
  return apiRequest({
    url: `/api/tasks/${updatedTask.id}`,
    method: "PUT",
    body: updatedTask,
  });
};

const deleteTaskById = async (id: number): Promise<void> => {
  return apiRequest({ url: `/api/tasks/${id}`, method: "DELETE" });
};

// Zustand store for tasks
export const useTasksStore = create<TasksState>()(
  devtools((set, get) => ({
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
        throw err;
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
        throw err;
      }
    },

    // Update an existing task using the API and update the store
    updateTask: async (updatedTask) => {
      set({ loading: true, error: null });
      try {
        const updated = await putTask(updatedTask);
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === updatedTask.id ? { ...task, ...updated } : task,
          ),
          loading: false,
        }));
      } catch (err) {
        set({ error: (err as Error).message, loading: false });
        throw err;
      }
    },

    // Delete a task using the API and update the store
    deleteTask: async (id) => {
      const currentTasks = get().tasks; // Save current state before the optimistic update

      // Optimistic update: Remove task before API response
      set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== id),
        loading: true,
        error: null,
      }));

      try {
        await deleteTaskById(id);
        set({ loading: false });
      } catch (err) {
        // Revert state if API call fails
        set({
          tasks: currentTasks, // Restore previous state
          error: (err as Error).message,
          loading: false,
        });
        throw err;
      }
    },
  })),
);
