import { Response } from "express";
import prisma from "@/libs/prisma";
import { validateToken } from "@/middleware/auth";

interface GetUsersQuery {
  page: string;
  limit: string;
}

const user = async (req: any, res: Response): Promise<Response> => {
  // Validación y manejo de la solicitud GET para obtener usuarios
  if (req.method === "GET" && ["admin"].includes(req.user.role)) {
    try {
      const { page="1", limit="10" } = req.query as GetUsersQuery;

      const data = await prisma.user.findMany({
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
        select: {
          id: true,
          username: true,
          role: true,
          updatedAt: true,
          tasks: true
        },
      });
      const totalItems = await prisma.user.count({});
      return res.status(200).json({
        data,
        totalItems,
        totalPages: Math.ceil(totalItems / parseInt(limit)),
      });
    } catch (error) {
      return res.status(500).json({ error: "Error al obtener los usuarios" });
    }
  }

  return res.status(405).json({ error: "Método no permitido" });
};

export default validateToken(user);
