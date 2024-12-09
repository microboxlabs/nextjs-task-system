import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../prisma/client";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const user = await prisma.user.findUnique({ where: { id: Number(id) }, include: { tasks: true, group: true } });
      if (!user) return res.status(404).json({ error: "User not found" });
      res.status(200).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error fetching user" });
    }
  }

  if (req.method === "PUT") {
    const { email, password, role, groupId } = req.body;
    try {
      const updatedUser = await prisma.user.update({
        where: { id: Number(id) },
        data: { email, password, role, groupId },
      });
      res.status(200).json(updatedUser);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error updating user" });
    }
  }

  if (req.method === "DELETE") {
    try {
      await prisma.user.delete({ where: { id: Number(id) } });
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error deleting user" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
