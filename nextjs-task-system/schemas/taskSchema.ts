import { z } from "zod";

export const assignedToSchema = z.object({
  type: z.enum(["user", "group"]),
  id: z.number().min(1, "Assigned ID is required"),
});

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
  assignedTo: assignedToSchema.optional(),
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
  assignedTo: assignedToSchema.optional(),
  priority: z.enum(["low", "medium", "high"]).default("medium").optional(),
});
