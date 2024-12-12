import prisma from "./prisma";
import { compareSync } from "bcrypt";

export async function userExists(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    return !!user; // return user
  } catch (error) {
    console.error("Error al verificar usuario:", error);
    return false; // there is no user
  }
}

export async function authenticateUser(email: string, password: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const isMatch = await compareSync(password, user.password);

    if (!isMatch) {
      throw new Error("Incorrect password");
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    console.error("Error during sign-in:", error);
    throw error;
  }
}
