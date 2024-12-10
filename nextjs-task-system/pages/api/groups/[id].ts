import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../prisma/client";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const group = await prisma.group.findUnique({ where: { id: Number(id) }, include: { users: true, tasks: true } });
      if (!group) return res.status(404).json({ error: "Group not found" });
      res.status(200).json(group);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error fetching group" });
    }
  }

  if (req.method === "PUT") {
    const { name } = req.body;
    try {
      const updatedGroup = await prisma.group.update({
        where: { id: Number(id) },
        data: { name },
      });
      res.status(200).json(updatedGroup);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error updating group" });
    }
  }

  if (req.method === "DELETE") {
    try {
      await prisma.group.delete({ where: { id: Number(id) } });
      res.status(200).json({ message: "Group deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error deleting group" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
