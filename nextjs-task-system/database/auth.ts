import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// Clave secreta para firmar los JWT
const JWT_SECRET = process.env.JWT_SECRET || "mi-clave-secreta";

// aqui toma una contraseña simple y la encripta
export const hashPassword = (password: string) => {
  return bcrypt.hashSync(password, 10);
};

// Función para verificar contraseñas
export const comparePassword = (password: string, hashedPassword: string) => {
  return bcrypt.compareSync(password, hashedPassword);
};

// Función para generar un JWT
export const generateToken = (userId: number) => {
  return jwt.sign({ userId }, JWT_SECRET);
};

// Función para verificar el JWT (esto se usa para proteger las rutas)
export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
};
