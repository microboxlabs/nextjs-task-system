import { Response } from 'express';
import prisma from "@/libs/prisma";
import Encrypt from "@/libs/bcrypt";
import JWToken from "@/libs/jsonwebtoken";

export default async function handler(req: any, res: Response) {
  if (req.method === "GET") {
    try {
      // Decodificación de las credenciales básicas
      const basicCredentials = Buffer.from(
        req.headers.authorization?.split(" ").pop() ?? "",
        "base64"
      )
        .toString("binary")
        .split(":");
      const username = basicCredentials[0];
      const password = basicCredentials[1];

      const user = await prisma.user.findUnique({ where: { username } });
      if (!user || !(await new Encrypt(user.password).compare_str(password))) {
        return res.status(401).json({ error: "Credenciales incorrectas" });
      }

      // Generación del token JWT
      const token = new JWToken().parseJwt({
        id: user.id,
        username: user.username,
        role: user.role,
      });
      return res.status(200).json({
        token,
        id: user.id,
        username: user.username,
        role: user.role,
      });
    } catch (error) {
      return res.status(500).json({ error: "Error en el servidor" });
    }
  }

  return res.status(405).json({ error: "Método no permitido" });
}
