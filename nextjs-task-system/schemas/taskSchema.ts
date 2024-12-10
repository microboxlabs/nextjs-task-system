import { z } from "zod";

export const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  status: z.enum(["pending", "inProgress", "completed"]).default("pending"),
  dueDate: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid date format",
    })
    .optional(),
  assignedTo: z.string().min(1, "Assigned to is required").optional(),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
});

export const updateTaskSchema = z.object({
  id: z.number().positive("Task ID is required and must be a valid number"),
  title: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(["pending", "inProgress", "completed"]).optional(),
  dueDate: z
    .string()
    .optional()
    .refine(
      (date) => {
        return date ? !isNaN(Date.parse(date)) : true;
      },
      {
        message: "Invalid date format",
      },
    ),
  assignedTo: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
});

export const deleteTaskSchema = z.object({
  id: z.string().min(1, "Task ID is required"),
});
