import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../prisma/client";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, query, body } = req;

  try {
    if (method === "GET") {
      await handleGetRequest(query, res);
    } else if (method === "POST") {
      await handlePostRequest(body, res);
    } else {
      res.setHeader("Allow", ["GET", "POST"]);
      return res.status(405).json({ error: `Method ${method} not allowed` });
    }
  } catch (error) {
    console.error("Error in API handler:", error);
    res.status(500).json({ error: "Internal server error. Please try again." });
  }
}

async function handleGetRequest(query: any, res: NextApiResponse) {
  const isAdmin = query.admin === "true";
  const userId = query.userId ? parseInt(query.userId as string, 10) : undefined;
  const groupId = query.groupId ? parseInt(query.groupId as string, 10) : undefined;

  if (isAdmin) {
    // Obtener todas las tareas para el administrador
    const tasks = await prisma.task.findMany({
      include: {
        user: { select: { id: true, email: true } },
        group: { select: { id: true, name: true } },
        comments: {
          include: {
            user: { select: { id: true, email: true } },
          },
        },
      },
    });
    return res.status(200).json(tasks);
  }

  // Validación para solicitudes de usuarios normales
  if (!userId && !groupId) {
    return res.status(400).json({ error: "userId or groupId is required to fetch tasks" });
  }

  try {
    // Filtros dinámicos basados en userId y groupId
    const whereClause: any = {};
    if (userId) whereClause.userId = userId;
    if (groupId) whereClause.groupId = groupId;

    const tasks = await prisma.task.findMany({
      where: whereClause,
      include: {
        user: { select: { id: true, email: true } },
        group: { select: { id: true, name: true } },
        comments: {
          include: {
            user: { select: { id: true, email: true } },
          },
        },
      },
    });

    if (tasks.length === 0) {
      return res.status(404).json({ error: "No tasks found for the user or group" });
    }

    return res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return res.status(500).json({ error: "Failed to fetch tasks." });
  }
}

async function handlePostRequest(body: any, res: NextApiResponse) {
  if (body.comment) {
    await createComment(body, res);
  } else {
    await createTask(body, res);
  }
}

async function createComment(body: any, res: NextApiResponse) {
  const { content, taskId, userId } = body;

  if (!content || !taskId || !userId) {
    return res.status(400).json({
      error: "Comment content, taskId, and userId are required",
    });
  }

  const taskExists = await prisma.task.findUnique({ where: { id: Number(taskId) } });
  if (!taskExists) {
    return res.status(404).json({ error: "Task not found" });
  }

  const newComment = await prisma.comment.create({
    data: {
      content,
      taskId: Number(taskId),
      userId: Number(userId),
    },
  });

  return res.status(201).json(newComment);
}

async function createTask(body: any, res: NextApiResponse) {
  console.log("Body received:", body);

  const { title, description, priority, dueDate, userId, groupId } = body;

  // Validación de campos obligatorios
  if (!title || !description || !priority || !dueDate) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Normalizar y validar el campo priority
  const validPriorities = ["LOW", "MEDIUM", "HIGH"];
  const normalizedPriority = priority.toUpperCase(); // Convertir a mayúsculas
  if (!validPriorities.includes(normalizedPriority)) {
    return res.status(400).json({ error: "Invalid priority value" });
  }

  try {
    // Crear la tarea
    const newTask = await prisma.task.create({
      data: {
        title,
        description,
        priority: normalizedPriority, // Usar el valor normalizado
        dueDate: new Date(dueDate),
        ...(userId && { userId: Number(userId) }),
        ...(groupId && { groupId: Number(groupId) }),
      },
    });

    return res.status(201).json(newTask);
  } catch (error) {
    console.error("Error creating task:", error);
    return res.status(500).json({ error: "Internal server error. Please try again." });
  }
}
