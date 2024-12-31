import { Task } from "@/types/taskTypes";
import * as path from "path";
import * as fs from "fs";
import {
  AssignedToSchema,
  CreateTaskSchema,
  UpdateTaskSchema,
} from "@/schemas/taskSchema";

const storageFilePath = path.resolve(
  process.cwd(),
  "data",
  "tasks_storage.json",
);
const originalFilePath = path.resolve(process.cwd(), "data", "tasks_seed.json");
const initializeStorage = () => {
  if (!fs.existsSync(storageFilePath)) {
    try {
      fs.copyFileSync(originalFilePath, storageFilePath);
      console.log("Storage initialized from tasks_seed.json");
    } catch (err) {
      console.error("Error initializing storage:", err);
    }
  }
};

const readTasksFromStorage = (): Task[] => {
  initializeStorage();
  try {
    const data = fs.readFileSync(storageFilePath, "utf-8");
    return JSON.parse(data) as Task[];
  } catch (err) {
    console.error("Error reading tasks from storage:", err);
    return [];
  }
};

const writeTasksToStorage = (tasks: Task[]) => {
  try {
    fs.writeFileSync(storageFilePath, JSON.stringify(tasks, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing tasks to storage:", err);
  }
};

export const tasksAdapter = {
  fetchTasks: async (): Promise<Task[]> => {
    let tasks = readTasksFromStorage();
    if (tasks.length === 0) {
      // Initialize storage with the default JSON (this is redundant with initializeStorage)
      tasks = [...require("../data/tasks_seed.json")];
      writeTasksToStorage(tasks);
    }
    return tasks.map(formatTaskFromDB);
  },

  getTaskById: async (id: number): Promise<Task> => {
    const tasks = readTasksFromStorage();
    const task = tasks.find((task) => task.id === id);

    if (!task) {
      throw new Error("Task not found");
    }

    return formatTaskFromDB(task);
  },

  createTask: async (newTask: CreateTaskSchema): Promise<Task> => {
    const tasks = readTasksFromStorage();
    const nextId =
      tasks.length > 0 ? Math.max(...tasks.map((t) => t.id)) + 1 : 1;

    const task: Task = {
      id: nextId,
      ...newTask,
      createdAt: new Date().toISOString(),
      dueDate: newTask.dueDate || "",
    };

    tasks.push(task);
    writeTasksToStorage(tasks);

    return formatTaskFromDB(task);
  },

  updateTask: async (
    id: number,
    updatedTask: UpdateTaskSchema,
  ): Promise<Task> => {
    const tasks: Task[] = readTasksFromStorage();
    const taskIndex = tasks.findIndex((task) => task.id === id);

    if (taskIndex === -1) {
      throw new Error("Task not found");
    }

    tasks[taskIndex] = { ...tasks[taskIndex], ...updatedTask };
    writeTasksToStorage(tasks);

    return formatTaskFromDB(tasks[taskIndex]);
  },

  deleteTask: async (id: number): Promise<void> => {
    const tasks = readTasksFromStorage();
    const initialLength = tasks.length;

    const updatedTasks = tasks.filter((task) => task.id !== id);
    if (updatedTasks.length === initialLength) {
      throw new Error("Task not found");
    }

    writeTasksToStorage(updatedTasks);
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
