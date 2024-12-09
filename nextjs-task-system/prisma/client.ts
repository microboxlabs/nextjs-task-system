import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Crear o reutilizar la instancia de PrismaClient
export const prisma: PrismaClient = (() => {
  try {
    const client =
      globalForPrisma.prisma ||
      new PrismaClient({
        log:
          process.env.NODE_ENV === "development"
            ? ["query", "info", "warn", "error"] // Logs extendidos en desarrollo
            : ["error"], // Logs mínimos en producción
      });

    if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = client;

    // Conectar automáticamente en producción
    if (process.env.NODE_ENV === "production") {
      client.$connect().catch((error) => {
        console.error("Failed to connect Prisma Client:", error);
      });
    }

    return client;
  } catch (error) {
    console.error("Failed to initialize Prisma Client:", error);
    throw error;
  }
})();

// Exportar cliente de Prisma
export default prisma;
