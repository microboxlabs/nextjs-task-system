import GitHub from "next-auth/providers/github"
import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import type { Provider } from "next-auth/providers"
import { prisma } from "./prisma"
import bcrypt from "bcryptjs";

const providers: Provider[] = [
  Credentials({
    credentials: { 
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" } 
    },
    async authorize(c) {
      if (!c?.email || !c?.password) {
        return null; // Si no se enviaron las credenciales, no validamos.
      }

      try {
        // Buscar usuario en la base de datos
        const user = await prisma.user.findUnique({
          where: { email: c.email as string },
        });
  
        if (!user || !user.password) {
          // Usuario no encontrado o sin una contraseña guardada
          return null;
        }
  
        // Comparar la contraseña con bcrypt
        const isPasswordValid = await bcrypt.compare(
          c.password as string,
          user.password
        );
  
        if (isPasswordValid) {
          // La contraseña es válida, devolvemos la información del usuario
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role?.toLowerCase() as UserRole,
          };
        }
  
        return null; // Contraseña incorrecta
      } catch (error) {
        console.error("Error al intentar autenticar el usuario:");
        return null;
      }
    },
  }),
  GitHub,
]

export const providerMap = providers
  .map((provider) => {
    if (typeof provider === "function") {
      const providerData = provider()
      return { id: providerData.id, name: providerData.name }
    } else {
      return { id: provider.id, name: provider.name }
    }
  })
  .filter((provider) => provider.id !== "credentials")

export default {
  providers,
  pages: {
    signIn: "/auth/login"
  }
} satisfies NextAuthConfig