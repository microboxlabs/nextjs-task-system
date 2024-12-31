// app/login/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useNotificationStore, useAuthStore } from "@/stores";
import { apiRequest } from "@/utils/apiUtils";
import { User } from "@/types";
import { LoginForm } from "@/components/LoginForm";
import { AuthenticateUserSchema } from "@/schemas/authSchema";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();

  const { addNotification } = useNotificationStore();
  const router = useRouter();

  const handleSubmit = async ({
    username,
    password,
  }: AuthenticateUserSchema) => {
    setLoading(true);

    try {
      const response = await apiRequest<User>({
        url: "/api/auth",
        method: "POST",
        body: { username, password },
      });

      const user = response;
      login(user);
      router.push("/dashboard");
    } catch (error) {
      addNotification({
        message: (error as Error).message,
        type: "error",
      });
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-center p-2 md:p-4">
      <div className="w-full max-w-md">
        <h2 className="mb-2 text-2xl font-semibold text-gray-900 dark:text-white md:mb-4">
          Login
        </h2>
        <LoginForm onSubmit={handleSubmit} loading={loading} />
      </div>
    </div>
  );
}
