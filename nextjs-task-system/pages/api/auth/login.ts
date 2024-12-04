import { comparePassword, generateToken } from "@/database/auth";
import { db } from "@/database/task";
import { NextApiRequest, NextApiResponse } from "next";
import { User } from "@/types";

const login = (req: NextApiRequest, res: NextApiResponse) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  // Buscar el usuario por su nombre de usuario
  db.get(
    "SELECT * FROM users WHERE username = ?",
    [username],
    (err, user: User) => {
      if (err) {
        return res.status(500).json({ error: "Error checking user" });
      }

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Comparar la contraseña proporcionada con la almacenada
      const isPasswordValid = comparePassword(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid password" });
      }

      // Generar un token JWT
      const token = generateToken(user.id);

      // Devolver el token al usuario
      return res.status(200).json({ message: "Login successful", token });
    },
  );
};
export default login;
