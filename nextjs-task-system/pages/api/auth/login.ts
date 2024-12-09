import { NextApiRequest, NextApiResponse } from "next";
import { comparePassword, generateToken } from "../../../utils/auth";
import prisma from "../../../prisma/client";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, password } = req.body;

  // Validar y sanitizar entradas
  const sanitizedEmail = email?.trim().toLowerCase();
  const sanitizedPassword = password?.trim();

  if (!sanitizedEmail || !sanitizedPassword) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  if (!emailRegex.test(sanitizedEmail)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  try {
    // Buscar al usuario en la base de datos
    const user = await prisma.user.findUnique({ where: { email: sanitizedEmail } });

    if (!user || !(await comparePassword(sanitizedPassword, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generar token JWT
    const token = generateToken({
      id: user.id,
      role: user.role,
      email: user.email,
    });

    return res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch (error: any) {
    console.error("Error during login:", error.message || error);

    // Manejar errores específicos de Prisma (si es necesario)
    if (error.code === "P2002") {
      return res.status(409).json({ error: "Database conflict error" });
    }

    return res.status(500).json({ error: "Internal server error" });
  }
}
