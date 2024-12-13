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
  title: z.string().min(1, "Title is required").optional(),
  description: z.string().min(1, "Description is required").optional(),
  status: z
    .enum(["pending", "inProgress", "completed"])
    .default("pending")
    .optional(),
  dueDate: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid date format",
    })
    .optional(),
  assignedTo: z.string().min(1, "Assigned to is required").optional(),
  priority: z.enum(["low", "medium", "high"]).default("medium").optional(),
});
