"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { token } = useAuth();

  useEffect(() => {
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  return <>{children}</>;
};

export default ProtectedRoute;
