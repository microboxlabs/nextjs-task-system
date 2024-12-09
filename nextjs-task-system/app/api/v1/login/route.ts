import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
import { setAuthCookie } from "@/app/lib/cookies";
import { SignJWT } from "jose";

const prisma = new PrismaClient();
const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET_KEY || "your-secret-key");

export const POST = async (req: NextRequest) => {
  const { email, password } = await req.json();
  const checkUser = await prisma.users.findUnique({
    where: { email },
  });
  if (!checkUser) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }
  const isPasswordValid = await bcrypt.compare(password, checkUser.password);
  if (!isPasswordValid) {
    return Response.json({ error: "Invalid password" }, { status: 401 });
  }
  if (!SECRET_KEY) {
    throw new Error("SECRET_WORD is not defined");
  }
  try {
    // const token = jwt.sign({ email }, process.env.JWT_SECRET_KEY, {
    //   expiresIn: "1d",
    // });
    const token = await new SignJWT({email})
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("2h")
      .sign(SECRET_KEY);
    const id = checkUser.id;
    setAuthCookie(token);
    return Response.json({ token, id }, { status: 200 });
  } catch (error) {
    console.error("Login error:", error)
    return Response.json({ error: "Invalid login" }, { status: 400 });
  }
};
