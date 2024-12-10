import { NextApiRequest, NextApiResponse } from "next";
import { verifyToken } from "../../../utils/auth";
import prisma from "../../../prisma/client";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const decoded = verifyToken(token); // Decodificar el token usando utils/auth

    if (!decoded || typeof decoded !== "object") {
      return res.status(401).json({ error: "Invalid token" });
    }

    // Consultar usuario desde la base de datos
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, role: true, groupId: true },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user data:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
