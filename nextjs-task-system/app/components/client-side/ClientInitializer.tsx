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
    initializeAuth(); 
  }, [initializeAuth]);

  return <>{children}</>; 
};

