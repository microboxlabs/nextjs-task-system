// ZOD Validation for tasks
import { z } from "zod";
import { taskPriorityEnum } from "./schema"; // Adjust the import path as needed

export const createTaskSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Title is required" })
    .max(255, { message: "Title must be 255 characters or less" }),

  description: z.string().optional(),

  dueDate: z.coerce.date().refine((date) => date >= new Date(), {
    message: "Due date must be in the future",
  }),

  priority: z.enum(taskPriorityEnum.enumValues).optional().default("MEDIUM"),
});

export const updateTaskSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Title is required" })
    .max(255, { message: "Title must be 255 characters or less" })
    .optional(),

  description: z.string().optional(),

  dueDate: z.coerce
    .date()
    .refine((date) => date >= new Date(), {
      message: "Due date must be in the future",
    })
    .optional(),
});
// Infer the type for TypeScript
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
