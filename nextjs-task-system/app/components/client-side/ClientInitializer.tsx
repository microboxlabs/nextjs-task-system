"use client";

import { useEffect } from "react";
import { useAuthStore } from "../../store/authStore";

export const ClientInitializer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    initializeAuth(); // Inicializar autenticación desde localStorage
  }, [initializeAuth]);

  return <>{children}</>; // Renderiza el contenido que se pasa
};

