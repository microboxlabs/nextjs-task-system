"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { isAuthenticated, token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && token) {
      router.push("/dashboard");
    } else if (!token) {
      router.push("/login");
    }
  }, [isAuthenticated, token, router]);

  return <div>Loading...</div>;
}
