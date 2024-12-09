import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../prisma/client";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, body, query } = req;

  
  const user = {
    id: 1, 
    role: "REGULAR", 
  };

  if (method === "GET") {
   
    if (user.role !== "ADMIN") {
      return res.status(403).json({ error: "Access denied. Only admins can view comments." });
    }

    try {
      const taskId = query.taskId ? parseInt(query.taskId as string, 10) : null;

      if (!taskId || isNaN(taskId)) {
        return res.status(400).json({ error: "taskId is required and must be a valid number" });
      }

      const comments = await prisma.comment.findMany({
        where: { taskId },
        include: {
          user: { select: { id: true, email: true } },
        },
      });

      if (comments.length === 0) {
        return res.status(404).json({ error: "No comments found for this task" });
      }

      return res.status(200).json(comments);
    } catch (error: any) {
      console.error("Error fetching comments:", error);
      return res.status(500).json({ error: "Error fetching comments" });
    }
  }

  if (method === "POST") {
    try {
      const { content, taskId } = body;
  
      console.log("POST received:", { content, taskId, user });
  
      
      if (!content || !taskId) {
        return res.status(400).json({ error: "Content and taskId are required" });
      }
  
      
      const taskExists = await prisma.task.findUnique({
        where: { id: Number(taskId) },
      });
      if (!taskExists) {
        return res.status(404).json({ error: "Task not found" });
      }
  
      
      const userExists = await prisma.user.findUnique({
        where: { id: user.id },
      });
      if (!userExists) {
        return res.status(404).json({ error: "User not found" });
      }
  
      
      const newComment = await prisma.comment.create({
        data: {
          content,
          taskId: Number(taskId),
          userId: user.id, 
        },
      });
  
      console.log("Comment created successfully:", newComment);
      return res.status(201).json(newComment);
    } catch (error: any) {
      console.error("Error creating comment:", error.message);
      return res.status(500).json({ error: error.message || "Failed to create comment." });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
  


