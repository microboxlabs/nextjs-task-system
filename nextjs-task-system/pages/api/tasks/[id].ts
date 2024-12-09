import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../prisma/client";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = req.query.id ? parseInt(req.query.id as string, 10) : null;

  if (!id || isNaN(id)) {
    return res.status(400).json({ error: "Invalid or missing Task ID" });
  }

  if (req.method === "PUT") {
    const { title, description, priority, status, dueDate, userId, groupId } = req.body;
  
    console.log("Received data for update:", {
      id,
      title,
      description,
      priority,
      status,
      dueDate,
      userId,
      groupId,
    });
  
    const validPriorities = ["LOW", "MEDIUM", "HIGH"];
    const validStatuses = ["PENDING", "IN_PROGRESS", "COMPLETED"];
  
    // Validar valores de prioridad y estado
    if (priority && !validPriorities.includes(priority)) {
      return res
        .status(400)
        .json({ error: `Invalid priority value. Allowed: ${validPriorities.join(", ")}` });
    }
  
    if (status && !validStatuses.includes(status)) {
      return res
        .status(400)
        .json({ error: `Invalid status value. Allowed: ${validStatuses.join(", ")}` });
    }
  
    // Validar al menos uno de los campos para actualizar
    if (!title && !description && !priority && !status && !dueDate && !userId && !groupId) {
      return res.status(400).json({ error: "No fields provided for update." });
    }
  
    try {
      // Actualizar la tarea
      const updatedTask = await prisma.task.update({
        where: { id },
        data: {
          ...(title && { title }),
          ...(description && { description }),
          ...(priority && { priority }),
          ...(status && { status }),
          ...(dueDate && { dueDate: new Date(dueDate) }),
          ...(userId && { userId: Number(userId) }),
          ...(groupId && { groupId: Number(groupId) }),
        },
      });
  
      console.log("Task updated successfully:", updatedTask);
      return res.status(200).json(updatedTask);
    } catch (error: any) {
      console.error("Error updating task:", error);
  
      // Manejar errores específicos de Prisma
      if (error.code === "P2025") {
        return res.status(404).json({ error: "Task not found for the given ID." });
      }
  
      return res.status(500).json({ error: error.message || "Error updating task." });
    }
  }
  
 else if (req.method === "DELETE") {
    try {
      console.log("Attempting to delete task with ID:", id);

      // Verificar si la tarea existe
      const taskExists = await prisma.task.findUnique({ where: { id } });
      if (!taskExists) {
        console.log("Task not found:", id);
        return res.status(404).json({ error: "Task not found" });
      }

      // Eliminar comentarios y luego la tarea
      console.log("Deleting task and related comments...");
      await prisma.$transaction([
        prisma.comment.deleteMany({ where: { taskId: id } }),
        prisma.task.delete({ where: { id } }),
      ]);

      console.log("Task deleted successfully:", id);
      return res.status(204).end(); // Retornar respuesta sin contenido
    } catch (error: any) {
      console.error("Error deleting task:", error);
      return res.status(500).json({ error: error.message || "Error deleting task" });
    }
  } else {
    // Métodos no permitidos
    res.setHeader("Allow", ["PUT", "DELETE"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
