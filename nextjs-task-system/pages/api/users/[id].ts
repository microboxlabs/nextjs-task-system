import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../prisma/client";
import { hashPassword } from "../../../utils/auth"; // Asegúrate de tener esta función para manejar las contraseñas

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = req.query.id ? parseInt(req.query.id as string, 10) : null;

  // Validar el parámetro `id`
  if (!id || isNaN(id)) {
    return res.status(400).json({ error: "Invalid or missing User ID" });
  }

  if (req.method === "GET") {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
        include: {
          tasks: true,
          group: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.status(200).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error fetching user" });
    }
  }

  if (req.method === "PUT") {
    const { email, password, role, groupId } = req.body;

    try {
      let updatedData: any = { email, role, groupId };

      // Codificar contraseña si se proporciona
      if (password) {
        const hashedPassword = await hashPassword(password);
        updatedData.password = hashedPassword;
      }

      const updatedUser = await prisma.user.update({
        where: { id },
        data: updatedData,
      });

      // Excluir campos sensibles de la respuesta
      const { password: _, ...userWithoutPassword } = updatedUser;
      res.status(200).json(userWithoutPassword);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error updating user" });
    }
  }

  if (req.method === "DELETE") {
    try {
      await prisma.user.delete({ where: { id } });
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error deleting user" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
