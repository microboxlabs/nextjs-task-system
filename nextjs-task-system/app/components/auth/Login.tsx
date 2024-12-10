"use client";

import { useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { useRouter } from "next/navigation";
import { Button, Label, TextInput, Spinner } from "flowbite-react";

export function LoginComponent() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useAuthStore(); // Use only setUser to manage user state
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setMessage("Both email and password are required.");
      return;
    }

    setIsLoading(true);

    try {
      // Call login API
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Fetch user data after successful login
        const meResponse = await fetch("/api/auth/me", {
          method: "GET",
          credentials: "include", // Include cookies in the request
        });

        if (!meResponse.ok) {
          setMessage("Failed to fetch user information. Please try again.");
          return;
        }

        const user = await meResponse.json();
        setUser(user); // Set the user state in AuthStore

        // Redirect based on user role
        switch (user.role) {
          case "ADMIN":
            router.push("/admin");
            break;
          case "REGULAR":
            router.push("/user");
            break;
          default:
            setMessage("Unknown role. Please contact support.");
        }
      } else {
        setMessage(data.error || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setMessage("An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto flex max-w-md flex-col gap-4">
      <h1 className="text-2xl font-bold">Login to your account</h1>
      {message && <p className="text-red-500">{message}</p>}
      <div>
        <Label htmlFor="email" value="Email" />
        <TextInput
          id="email"
          type="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="password" value="Password" />
        <TextInput
          id="password"
          type="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleInputChange}
          required
        />
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? <Spinner size="sm" /> : "Submit"}
      </Button>
    </form>
  );
}
