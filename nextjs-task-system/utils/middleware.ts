import { verifyToken } from "@/database/auth";
import { db } from "@/database/task"; // Asegúrate de importar tu db
import { NextApiRequest, NextApiResponse } from "next";
import { User } from "@/types";

interface JwtPayload {
  userId: number;
}

export const protectRoute = (handler: any, requiredRole?: string) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Token is required" });
    }

    const decoded = verifyToken(token) as JwtPayload | null;

    if (!decoded) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    const userId = decoded.userId;

    // Si no se requiere un rol específico, solo pasa el userId
    if (!requiredRole) {
      req.userId = userId; // Añadir userId al objeto req
      return handler(req, res);
    }

    // Verificar rol si es requerido
    db.get(
      "SELECT role FROM users WHERE id = ?",
      [userId],
      (err, user: User) => {
        if (err) {
          return res.status(500).json({ error: "Error checking user role" });
        }

        if (!user || user.role !== requiredRole) {
          return res
            .status(403)
            .json({ error: "Forbidden: Insufficient permissions" });
        }

        req.userId = userId; // Añadir userId al objeto req
        return handler(req, res);
      },
    );
  };
};
