import { z } from "zod";

const TaskAssignedToType = z.enum(["user", "group"]);
const TaskPriority = z.enum(["low", "medium", "high"]);
const TaskStatus = z.enum(["pending", "inProgress", "completed"]);

export const assignedToSchema = z
  .object({
    type: TaskAssignedToType.nullable().optional(),
    id: z.number().nullable().optional(),
  })
  .refine(
    (data) => {
      if (data.type === null || data.type === undefined) {
        return data.id === null || data.id === undefined;
      }
      return data.id !== null && data.id !== undefined;
    },
    {
      message: "AssignedTo.id is required when assignedTo.type is selected",
    },
  )
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
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid date format",
    })
    .optional(),
  comments: z.array(z.string()).default([]),
});

// Export the inferred types
export type CreateTaskSchema = z.infer<typeof createTaskSchema>;
export type TaskPriorityType = z.infer<typeof TaskPriority>;
export type TaskStatusType = z.infer<typeof TaskStatus>;
