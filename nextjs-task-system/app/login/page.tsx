"use client";

import { useState } from "react";
import { Button, TextInput, Label, Spinner, Alert } from "flowbite-react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // evitar recarga de la página
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
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg dark:bg-gray-900">
        <h2 className="mb-4 text-center text-3xl font-bold text-gray-800 dark:text-white">
          Inicia Sesión
        </h2>
        {error && (
          <Alert color="failure" className="mb-4">
            {error}
          </Alert>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="username" value="Nombre de usuario" />
            <TextInput
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="mt-1"
              placeholder="Ingresa tu usuario"
            />
          </div>
          <div>
            <Label htmlFor="password" value="Contraseña" />
            <TextInput
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1"
              placeholder="Ingresa tu contraseña"
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={loading}
            gradientDuoTone="cyanToBlue"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <Spinner size="sm" className="mr-2" />
                Cargando...
              </div>
            ) : (
              "Iniciar sesión"
            )}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          No tienes una cuenta?{" "}
          <Link
            href="/register"
            className="font-medium text-blue-500 hover:underline"
          >
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
}
