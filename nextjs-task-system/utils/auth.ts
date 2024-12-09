import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Clave secreta para JWT
const SECRET_KEY = process.env.JWT_SECRET || "default_secret_key"; // Cambia esto en producción


export interface CustomJwtPayload extends jwt.JwtPayload {
  id: number;
  role: string;
  email: string;

}

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10; // Número de rondas para generar el hash
  return bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};


export const generateToken = (payload: CustomJwtPayload, expiresIn: string = "1h"): string => {
  return jwt.sign(payload, SECRET_KEY, { expiresIn });
};

export const verifyToken = (token: string): CustomJwtPayload | null => {
  try {
    const decoded = jwt.verify(token, SECRET_KEY) as CustomJwtPayload; 
    return decoded;
  } catch (error) {
    console.error("Invalid token:", error);
    throw new Error("Invalid or expired token");
  }
};

export const authenticateToken = (authorizationHeader: string | undefined): CustomJwtPayload => {
  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    throw new Error("Authorization header missing or malformed");
  }

  const token = authorizationHeader.split(" ")[1];
  const decoded = verifyToken(token);

  if (!decoded || typeof decoded !== "object") {
    throw new Error("Invalid or malformed token");
  }

  return decoded;
};

