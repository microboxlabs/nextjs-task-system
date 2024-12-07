"use client"; //habilitar el uso del cliente

import { useState } from "react";
import { Button, TextInput } from "flowbite-react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // evitar recarga de la pagina

    // limpiar errores anteriores
    setError(null);
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/login",
        {
          username,
          password,
        },
      );

      login(response.data.token, response.data.user);
    } catch (err: any) {
      setError(
        "Error al iniciar sesión. Por favor, verifica tus credenciales.",
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-800">
      <div className="w-full max-w-md space-y-4 rounded-lg bg-white p-8 shadow-lg dark:bg-gray-900">
        <h2 className="text-center text-2xl font-semibold dark:text-white">
          Login
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              {error && (
                <div className="mb-2 text-center text-red-500">{error}</div>
              )}

              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 dark:text-white"
              >
                Username
              </label>
              <TextInput
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="mt-1"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-white"
              >
                Password
              </label>
              <TextInput
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1"
              />
            </div>
            <Button type="submit" className="w-full">
              {loading ? "Cargando..." : "Iniciar sesión"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
