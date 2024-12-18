import { and, eq, exists, inArray, not, or } from "drizzle-orm";
import { CreateTaskInput, UpdateTaskInput } from "../z-tasks";
import { db } from "..";
import {
  comments,
  groupMemberships,
  groups,
  TaskPriority,
  tasks,
  TaskStatus,
  users,
} from "../schema";
import { isUserAdmin, queryErrors } from ".";
import { getUserById } from "./user";

export type UpdateTaskT = {
  status?: TaskStatus;
  priority?: TaskPriority;
};

export async function createTask(
  input: CreateTaskInput,
  currentUserId: string,
) {
  await isUserAdmin(currentUserId);

  const newTask = await db
    .insert(tasks)
    .values({
      title: input.title,
      description: input.description,
      dueDate: input.dueDate,
      priority: input.priority,
      creatorId: currentUserId,
    })
    .returning();
  return await getTaskById(newTask[0].id);
}

export async function deleteTask(taskId: string, userId: string) {
  await isUserAdmin(userId);
  const task = await getTaskById(taskId);

  if (!task) throw new Error(queryErrors.notFound);

  return await db.delete(tasks).where(eq(tasks.id, taskId));
}

export async function updateTask(
  userId: string,
  taskId: string,
  data: UpdateTaskInput,
) {
  await isUserAdmin(userId);

  const task = await getTaskById(taskId);
  if (!task) throw new Error(queryErrors.notFound);
  await db
    .update(tasks)
    .set({
      title: data.title,
      description: data.description,
      dueDate: data.dueDate,
    })
    .where(eq(tasks.id, taskId))
    .returning();

  return getTaskById(taskId);
}

export async function updateTaskPriorityStatus(
  taskId: string,
  updateValues: UpdateTaskT,
) {
  const task = await getTaskById(taskId);
  if (!task) throw new Error(queryErrors.notFound);
  await db
    .update(tasks)
    .set(
      updateValues.status
        ? { status: updateValues.status }
        : { priority: updateValues.priority },
    )
    .where(eq(tasks.id, taskId));
  return await getTaskById(taskId);
}

export async function getTaskById(taskId: string) {
  return await db.query.tasks.findFirst({
    where: eq(tasks.id, taskId),
    with: {
      assignedGroup: true,
      assignedUser: true,
    },
  });
}

// returns the tasks that are not archived
export async function getActiveTasks(userId: string) {
  // If the user is an admin, return all active tasks
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
    columns: {
      id: true,
      role: true,
    },
    with: {
      groupMemberships: {
        columns: {
          groupId: true,
        },
      },
    },
  });

  if (!user) throw new Error(queryErrors.notFound);
  const isAdmin = user.role === "ADMIN";
  if (isAdmin) {
    return await db.query.tasks.findMany({
      where: not(eq(tasks.status, "ARCHIVED")),
      with: {
        assignedUser: true,
        assignedGroup: true,
      },
    });
  }

  // For non-admin users, find:
  // 1. Tasks directly assigned to the user
  // 2. Tasks assigned to groups the user belongs to
  const userGroupIds = user.groupMemberships.map(
    (membership) => membership.groupId,
  );

  return await db.query.tasks.findMany({
    where: and(
      not(eq(tasks.status, "ARCHIVED")),
      or(
        eq(tasks.assignedToUserId, userId),
        userGroupIds.length > 0
          ? inArray(tasks.assignedToGroupId, userGroupIds)
          : undefined,
      ),
    ),
    with: {
      assignedUser: true,
      assignedGroup: true,
    },
  });
}

export async function assignTask(
  userId: string,
  targetId: string,
  taskId: string,
  isUser: boolean = true,
) {
  await isUserAdmin(userId);
  const targetExists = isUser
    ? await db.query.users.findFirst({
        where: eq(users.id, targetId),
      })
    : await db.query.groups.findFirst({
        where: eq(groups.id, targetId),
      });

  const taskExists = await getTaskById(taskId);
  if (!targetExists || !taskExists) throw new Error(queryErrors.notFound);

  await db
    .update(tasks)
    .set({
      assignedToGroupId: isUser ? null : targetId,
      assignedToUserId: isUser ? targetId : null,
    })
    .where(eq(tasks.id, taskId));

  return await getTaskById(taskId);
}

export async function removeAssigned(userId: string, taskId: string) {
  await isUserAdmin(userId);

  const taskExists = await getTaskById(taskId);
  if (!taskExists) throw new Error(queryErrors.notFound);

  await db
    .update(tasks)
    .set({ assignedToGroupId: null, assignedToUserId: null })
    .where(eq(tasks.id, taskId));

  return await getTaskById(taskId);
}

export async function createComment(
  userId: string,
  taskId: string,
  content: string,
) {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });
  const task = await getTaskById(taskId);

  if (!task || !user) throw new Error(queryErrors.notFound);

  // should add extra validation for checking if:
  // ? if the user is not an admin
  // ? the user should be assigned to the task
  // ? the user should be included to the group that's assigned
  // ? Only if this conditions are met then the user can create a new comment on the task

  return await db
    .insert(comments)
    .values({ userId, content, taskId })
    .returning();
}

export async function getComments(taskId: string) {
  const task = await getTaskById(taskId);
  if (!task) throw new Error(queryErrors.notFound);
  return await db.query.comments.findMany({
    where: eq(comments.taskId, taskId),
    with: {
      user: true,
    },
  });
}

export async function deleteComment(userId: string, commentId: string) {
  const comment = await db.query.comments.findFirst({
    where: and(eq(comments.id, commentId), eq(comments.userId, userId)),
  });
  if (!comment) throw new Error(queryErrors.notFound);
  return await db
    .delete(comments)
    .where(eq(comments.id, commentId))
    .returning();
}
