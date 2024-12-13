// app/login/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Label, TextInput, Button } from "flowbite-react";
import { useNotificationStore } from "@/stores/notificationStore";
import { apiRequest } from "@/utils/apiUtils";
import { User } from "@/types";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { addNotification } = useNotificationStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await apiRequest<User>({
        url: "/api/auth",
        method: "POST",
        body: { username, password },
      });
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
    <form
      onSubmit={handleSubmit}
      className="flex w-full flex-col gap-2 md:gap-4"
    >
      <div>
        <div className="mb-2 block">
          <Label htmlFor="username" value="Username" />
        </div>
        <TextInput
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={loading}
        />
      </div>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="password" value="Password" />
        </div>
        <TextInput
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />
      </div>
      <div className="mt-4 flex flex-col gap-4 md:flex-row">
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Logging in..." : "Login"}
        </Button>
      </div>
    </form>
  );
}
