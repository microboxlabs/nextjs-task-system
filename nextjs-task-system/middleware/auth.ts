import { Response } from 'express';
import JWToken from "@/libs/jsonwebtoken";

export const validateToken = (handler: (req: any, res: Response) => Promise<Response> ) => {
  return async (req: any, res: Response) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Token no proporcionado o formato inválido" });
    }

    const token = authHeader.split(" ")[1];
    try {
      const jwtInstance = new JWToken();
      const decoded = jwtInstance.verifyJwt(token);
      req.user = decoded;

      return handler(req, res);
    } catch (error) {
      return res.status(401).json({ error: "Token inválido" });
    }
  };
};
