import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../prisma/client";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = req.query.id ? parseInt(req.query.id as string, 10) : null;

  if (!id || isNaN(id)) {
    return res.status(400).json({ error: "Invalid or missing Task ID" });
  }

  const validPriorities = ["LOW", "MEDIUM", "HIGH"];
  const validStatuses = ["PENDING", "IN_PROGRESS", "COMPLETED"];

  if (req.method === "PUT") {
    const { title, description, priority, status, dueDate, userId, groupId } = req.body;
  
    if (priority && !validPriorities.includes(priority)) {
      return res.status(400).json({
        error: `Invalid priority value. Allowed: ${validPriorities.join(", ")}`,
      });
    }

    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        error: `Invalid status value. Allowed: ${validStatuses.join(", ")}`,
      });
    }

   
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


      return res.status(200).json(updatedTask);
    } catch (error: any) {
      console.error("Error updating task:", error);

      
      if (error.code === "P2025") {
        return res.status(404).json({ error: "Task not found for the given ID." });
      }

      return res.status(500).json({ error: error.message || "Error updating task." });
    }
  } else if (req.method === "DELETE") {
    try {


      
      const taskExists = await prisma.task.findUnique({ where: { id } });
      if (!taskExists) {
        return res.status(404).json({ error: "Task not found" });
      }

      

      await prisma.$transaction([
        prisma.comment.deleteMany({ where: { taskId: id } }),
        prisma.task.delete({ where: { id } }),
      ]);


      return res.status(204).end(); 
    } catch (error: any) {
      console.error("Error deleting task:", error);
      return res.status(500).json({ error: error.message || "Error deleting task" });
    }
  } else {
    
    res.setHeader("Allow", ["PUT", "DELETE"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
