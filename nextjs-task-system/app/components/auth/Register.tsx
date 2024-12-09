"use client";

import { useState } from "react";
import { Button, Checkbox, Label, TextInput, Spinner } from "flowbite-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function RegisterComponent() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    repeatPassword: "",
  });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false); 
  const router = useRouter();

  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    console.log(`Updating ${id} to: ${value}`); 
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // Validar formulario
  const validateForm = () => {
    console.log("Validating form:", formData); 
    if (!formData.email.includes("@")) {
      setMessage("Please enter a valid email address.");
      return false;
    }
    if (formData.password.length < 6) {
      setMessage("Password must be at least 6 characters long.");
      return false;
    }
    if (formData.password !== formData.repeatPassword) {
      setMessage("Passwords do not match.");
      return false;
    }
    return true;
  };

  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setMessage(""); 

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        
        const errorData = await response.json();
        setMessage(errorData.error || "Registration failed.");
        return;
      }

      const data = await response.json();
      setMessage("Registration successful! Redirecting to login...");
      setTimeout(() => router.push("/auth/login"), 2000); // Redirigir después de 2 segundos
    } catch (error) {
      console.error("Error during registration:", error);
      setMessage("An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex max-w-md flex-col gap-4 px-4 py-6"
    >
      <h1 className="text-2xl font-bold">Create a new account</h1>
      {message && (
        <p
          className={`text-center ${
            message.includes("successful") ? "text-green-500" : "text-red-500"
          }`}
        >
          {message}
        </p>
      )}
      <TextInput
        id="email"
        type="email"
        placeholder="Enter your email"
        required
        value={formData.email}
        onChange={handleInputChange}
      />
      <TextInput
        id="password"
        type="password"
        placeholder="Enter your password"
        required
        value={formData.password}
        onChange={handleInputChange}
      />
      <TextInput
        id="repeatPassword"
        type="password"
        placeholder="Repeat your password"
        required
        value={formData.repeatPassword}
        onChange={handleInputChange}
      />
      <div className="flex items-center gap-2">
        <Checkbox id="agree" required />
        <Label htmlFor="agree">
          I agree with the&nbsp;
          <Link href="#" className="text-blue-500 hover:underline">
            terms and conditions
          </Link>
        </Label>
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? <Spinner size="sm" /> : "Register"}
      </Button>
    </form>
  );
}
