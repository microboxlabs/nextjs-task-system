import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export const GET = async () => {
  const users = await prisma.users.findMany();
  return Response.json(users);
};

export const POST = async (req: NextRequest) => {
  const { name, email, password } = await req.json();
  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await prisma.users.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });
  return Response.json(user);
};