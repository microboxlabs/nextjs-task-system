import prisma from "@/libs/prisma";
import { validateToken } from "@/middleware/auth";

 async function user(req, res) {
  if (req.method == "GET" && ["admin"].includes(req.user.role)) {
    try {
      const {page, limit} = req.query
      const data = await prisma.user.findMany({
        skip: (page - 1) * limit,
        take: parseInt(limit),
        select: {
          id: true,
          username: true,
          role: true,
          updatedAt: true,
          tasks: true
        }
      });
      const totalItems = await prisma.user.count({
        
      });
      return res.status(201).json({ 
        data,
        totalItems: data.length,
        totalPages: Math.ceil(totalItems / limit)
      });
    } catch (error) {
      return res.status(500).json({ error: "Error al registrar usuario" });
    }
  }

  return res.status(405).json({ error: "Método no permitido" });
}

export default validateToken(user);