import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../prisma/client";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const groups = await prisma.group.findMany({ include: { users: true, tasks: true } });
      res.status(200).json(groups);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error fetching groups" });
    }
  }

  if (req.method === "POST") {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "Group name is required" });

    try {
      const newGroup = await prisma.group.create({
        data: { name },
      });
      res.status(201).json(newGroup);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error creating group" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
