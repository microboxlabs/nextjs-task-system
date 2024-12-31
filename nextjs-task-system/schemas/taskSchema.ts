// schemas/taskSchema.ts
import { z } from "zod";

const TaskPriority = z.enum(["low", "medium", "high"]);
const TaskStatus = z.enum(["pending", "inProgress", "completed"]);
const TaskAssignedToType = z.enum(["user", "group"]);

export const assignedToSchema = z
  .object({
    type: TaskAssignedToType.nullable().optional(),
    id: z.number().nullable().optional(),
  })
  .refine(
    (data) => {
      if (data.type) {
        return typeof data.id === "number";
      }
      return true;
    },
    {
      message: "AssignedTo.id is required when assignedTo.type is selected",
    },
  )
  .transform((data) => (!data.type ? null : data))
  .nullable();

export const createTaskSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  status: TaskStatus.default("pending").refine(
    (value) => Object.values(TaskStatus.options).includes(value),
    {
      message: "Status must be one of: pending, inProgress, completed",
    },
  ),
  priority: TaskPriority.refine(
    (value) => Object.values(TaskPriority.options).includes(value),
    {
      message: "Priority must be one of: low, medium, high",
    },
  ),
  assignedTo: assignedToSchema,
  dueDate: z
    .string()
    .refine((date) => date === "" || !isNaN(Date.parse(date)), {
      message: "Invalid date format",
    })
    .optional(),
  comments: z
    .array(z.string().min(1, { message: "Comment cannot be empty" }))
    .default([]),
});

export const updateTaskSchema = createTaskSchema
  .extend({
    id: z.number().optional(),
  })
  .partial({
    title: true,
    description: true,
    status: true,
    priority: true,
    assignedTo: true,
    dueDate: true,
    comments: true,
  });

// Export the inferred types
export type CreateTaskSchema = z.infer<typeof createTaskSchema>;
export type UpdateTaskSchema = z.infer<typeof updateTaskSchema>;
export type TaskPriorityType = z.infer<typeof TaskPriority>;
export type TaskStatusType = z.infer<typeof TaskStatus>;
export type TaskAssignedToType = z.infer<typeof TaskAssignedToType>;
export type AssignedToSchema = z.infer<typeof assignedToSchema>;
