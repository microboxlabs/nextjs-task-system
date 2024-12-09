import { NextApiRequest, NextApiResponse } from "next";
import { hashPassword } from "../../../utils/auth";
import prisma from "../../../prisma/client";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, password, role } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  if (password.length < 8) {
    return res.status(400).json({ error: "Password must be at least 8 characters long" });
  }

  if (role === "ADMIN") {
    return res.status(403).json({ error: "Unauthorized to create admin users" });
  }

  try {
    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return res.status(409).json({ error: "User already exists" });
    }

    // Hashear la contraseña
    const hashedPassword = await hashPassword(password);

    // Crear el nuevo usuario
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: role || "REGULAR",
      },
    });

    return res.status(201).json({
      message: "User created successfully",
      user: { id: newUser.id, email: newUser.email, role: newUser.role },
    });
  } catch (error: any) {
    console.error("Error during registration:", error.message || error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
