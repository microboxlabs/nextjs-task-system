// app/api/users/index.ts
import { hashPassword } from "@/database/auth";
import { db } from "@/database/task";
import { protectRoute } from "@/utils/middleware";
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      return protectRoute(getUsers, "admin")(req, res);
    case "POST":
      return protectRoute(createUser, "admin")(req, res);
    default:
      return res.status(405).json({ message: "Method Not Allowed" });
  }
}

// Obtener todos los usuarios
const getUsers = (req: NextApiRequest, res: NextApiResponse) => {
  db.all("SELECT * FROM users", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: "Error fetching users" });
    }
    return res.status(200).json(rows);
  });
};

const createUser = (req: NextApiRequest, res: NextApiResponse) => {
  const { username, password, role } = req.body;

  if (!username || !password || !role) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Encripta la contraseña antes de almacenarla
  const hashedPassword = hashPassword(password);

  // Inserta el usuario con la contraseña encriptada
  db.run(
    `INSERT INTO users (username, password, role) VALUES (?, ?, ?)`,
    [username, hashedPassword, role],
    function (err) {
      if (err) {
        return res.status(500).json({ error: "Error creating user " + err });
      }
      return res
        .status(201)
        .json({ id: this.lastID, message: "User created successfully" });
    },
  );
};
