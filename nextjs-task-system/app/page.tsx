"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { isAuthenticated, token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("Service Worker registrado:", registration);
        })
        .catch((error) => {
          console.error("Error al registrar Service Worker:", error);
        });
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && token) {
      router.push("/dashboard");
    } else if (!token) {
      router.push("/login");
    }
  }, [isAuthenticated, token, router]);

  return <div>Loading...</div>;
}
