import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../prisma/client";
import { getTokenFromCookies } from "../../../utils/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, body, query } = req;

  try {
    const user = getTokenFromCookies(req);

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (method === "GET") {
      if (user.role !== "ADMIN") {
        return res.status(403).json({ error: "Access denied. Only admins can view comments." });
      }

      const taskId = query.taskId ? parseInt(query.taskId as string, 10) : null;

      if (!taskId) {
        return res.status(400).json({ error: "Task ID is required" });
      }

      const comments = await prisma.comment.findMany({
        where: { taskId },
        include: { user: { select: { id: true, email: true } } },
      });

      if (comments.length === 0) {
        return res.status(404).json({ error: "No comments found for this task" });
      }

      return res.status(200).json(comments);
    }

    if (method === "POST") {
      const { content, taskId } = body;

      if (!content || !taskId) {
        return res.status(400).json({ error: "Content and Task ID are required" });
      }

      const taskExists = await prisma.task.findUnique({
        where: { id: Number(taskId) },
      });

      if (!taskExists) {
        return res.status(404).json({ error: "Task not found" });
      }

      const newComment = await prisma.comment.create({
        data: {
          content,
          taskId: Number(taskId),
          userId: user.id,
        },
      });

      return res.status(201).json(newComment);
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ error: `Method ${method} not allowed` });
  } catch (error: any) {
    console.error("Error handling comment request:", error.message || error);
    res.status(500).json({ error: "Internal server error" });
  }
}
