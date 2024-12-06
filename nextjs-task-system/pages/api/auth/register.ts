import Encrypt from "@/libs/bcrypt";
import { expressValidator, validator } from "@/libs/express-validator";
import prisma from "@/libs/prisma";
import { Role } from "@prisma/client";

export default async function register(req: any, res: any) {
  if (req.method == "POST") {

    await expressValidator(req,res, validator.createUser)
    const { username, password, role= Role.regular } = req.body;
    
    try {
      const hashedPassword = await new Encrypt(password).encrypt_str();
      const user = await prisma.user.create({
        data: { username, password: hashedPassword, role},
      });
      return res.status(201).json({ message: "Usuario registrado exitosamente", user });
    } catch (error) {
      return res.status(500).json({ error: "Error al registrar usuario" });
    }
  }
  return res.status(405).json({ error: "Método no permitido" });
}
