// lib/init.ts
import { initializeDB } from "@/database/task";

// Inicializar la base de datos
export const initDB = () => {
  initializeDB();
  console.log("Database initialized.");
};
