import tasks from "../data/tasks.json";
import { Task } from "@/types/taskTypes";

let taskList = [...tasks]; // Simulating an in-memory database

export const tasksAdapter = {
  getTaskById: async (id: number): Promise<Task> => {
    const task = taskList.find((task) => task.id === id);

    if (!task) {
      throw new Error("Task not found");
    }

    // Simulate database response time
    return new Promise((resolve) => {
      setTimeout(() => resolve(formatTaskFromDB(task)), 100);
    });
  },

  fetchTasks: async (): Promise<Task[]> => {
    // Simulates querying the task list from the database
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(taskList.map(formatTaskFromDB));
      }, 100);
    });
  },

  createTask: async (newTask: Omit<Task, "id">): Promise<Task> => {
    // Generate an ID simulating auto-increment behavior
    const nextId =
      taskList.length > 0 ? Math.max(...taskList.map((t) => t.id)) + 1 : 1;

    const task = {
      id: nextId,
      ...newTask,
      createdAt: new Date().toISOString(),
      dueDate: newTask.dueDate || "",
      assignedTo: newTask.assignedTo || "",
    };

    taskList.push(task);
    // Simulates inserting into the database
    return new Promise((resolve) => {
      setTimeout(() => resolve(formatTaskFromDB(task)), 100);
    });
  },

  updateTask: async (id: number, updatedTask: Partial<Task>): Promise<Task> => {
    const taskIndex = taskList.findIndex((task) => task.id === id);
    if (taskIndex === -1) {
      throw new Error("Task not found");
    }
    taskList[taskIndex] = { ...taskList[taskIndex], ...updatedTask };
    // Simulates updating in the database
    return new Promise((resolve) => {
      setTimeout(() => resolve(formatTaskFromDB(taskList[taskIndex])), 100);
    });
  },

  deleteTask: async (id: number): Promise<void> => {
    const initialLength = taskList.length;
    taskList = taskList.filter((task) => task.id !== id);
    if (taskList.length === initialLength) {
      throw new Error("Task not found");
    }
    // Simulates deletion in the database
    return new Promise((resolve) => {
      setTimeout(() => resolve(), 100);
    });
  },
};

function formatTaskFromDB(dbTask: any): Task {
  return {
    id: dbTask.id,
    title: dbTask.title,
    description: dbTask.description,
    status: dbTask.status as "pending" | "inProgress" | "completed",
    dueDate: dbTask.dueDate,
    assignedTo: dbTask.assignedTo,
    priority: dbTask.priority as "low" | "medium" | "high",
    comments: Array.isArray(dbTask.comments)
      ? dbTask.comments
      : JSON.parse(dbTask.comments || "[]"), // If it is a string we convert it to array
    createdAt: dbTask.createdAt,
  };
}

function formatTaskToDB(apiTask: Task): any {
  return {
    id: apiTask.id,
    title: apiTask.title,
    description: apiTask.description,
    status: apiTask.status,
    dueDate: apiTask.dueDate,
    assignedTo: apiTask.assignedTo,
    priority: apiTask.priority,
    comments: JSON.stringify(apiTask.comments), // Convert array to string
  };
}
