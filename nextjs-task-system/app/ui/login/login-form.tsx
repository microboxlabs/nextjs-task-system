"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Checkbox, Label, TextInput } from "flowbite-react";
import { jwtDecode } from "jwt-decode";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }
      const data = await response.json();
      const decodeToken = jwtDecode(data.token);
      const { role } = decodeToken;

      if (role === "adm") {
        router.push("/dashboard");
      }

      router.push("/my-tasks");
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="flex max-w-md flex-col gap-4" onSubmit={handleSubmit}>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="email" value="Your email" />
        </div>
        <TextInput
          id="email"
          type="email"
          placeholder="name@flowbite.com"
          name="email"
          required
        />
      </div>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="password" value="Your password" />
        </div>
        <TextInput id="password" type="password" name="password" required />
      </div>

      {error}
      <Button type="submit">{loading ? "loading..." : "submit"}</Button>
    </form>
  );
}
