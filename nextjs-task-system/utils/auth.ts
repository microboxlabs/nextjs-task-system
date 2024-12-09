import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { serialize } from "cookie"; // To set cookies in responses
import { IncomingMessage, ServerResponse } from "http";

const SECRET_KEY = process.env.JWT_SECRET || "default_secret_key"; // Cambia esto en producción

export interface CustomJwtPayload extends jwt.JwtPayload {
  id: number;
  role: string;
  email: string;
}

// Hash the password using bcrypt
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
};

// Compare plain text password with the hashed password
export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

// Generate a JWT and return it
export const generateToken = (payload: CustomJwtPayload, expiresIn: string = "1h"): string => {
  return jwt.sign(payload, SECRET_KEY, { expiresIn });
};

// Verify a JWT and return its payload
export const verifyToken = (token: string): CustomJwtPayload | null => {
  try {
    return jwt.verify(token, SECRET_KEY) as CustomJwtPayload;
  } catch (error) {
    console.error("Invalid token:", error);
    throw new Error("Invalid or expired token");
  }
};

// Set the token as an HttpOnly cookie
export const setTokenCookie = (res: ServerResponse, token: string): void => {
  const cookie = serialize("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 3600, // 1 hour
    path: "/",
  });

  res.setHeader("Set-Cookie", cookie);
};

// Clear the token from cookies
export const clearTokenCookie = (res: ServerResponse): void => {
  const cookie = serialize("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 0,
    path: "/",
  });

  res.setHeader("Set-Cookie", cookie);
};

// Extract and verify the token from cookies
export const getTokenFromCookies = (req: IncomingMessage): CustomJwtPayload | null => {
  const cookieHeader = req.headers.cookie || "";
  const cookies = Object.fromEntries(
    cookieHeader.split("; ").map((c) => c.split("="))
  );

  const token = cookies["token"];
  if (!token) {
    throw new Error("Token not found in cookies");
  }

  return verifyToken(token);
};
