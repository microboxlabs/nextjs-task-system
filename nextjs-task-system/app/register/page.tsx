"use client";

import { useState } from "react";
import { Button, TextInput, Label, Spinner, Alert } from "flowbite-react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      setLoading(false);
      return;
    }

    try {
      await axios.post("http://localhost:3000/api/users", {
        username,
        password,
        role: "admin",
      });
      setSuccess("Usuario registrado exitosamente. Puedes iniciar sesión.");
      setUsername("");
      setPassword("");
      setConfirmPassword("");
      alert("Usuario registrado correctamente");
      router.push("/login");
    } catch (err: any) {
      setError("Error al registrar el usuario. Por favor, intenta nuevamente.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-800">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg dark:bg-gray-900">
        <h2 className="mb-4 text-center text-3xl font-bold text-gray-800 dark:text-white">
          Regístrate
        </h2>
        {error && (
          <Alert color="failure" className="mb-4">
            {error}
          </Alert>
        )}
        {success && (
          <Alert color="success" className="mb-4">
            {success}
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
          <div>
            <Label htmlFor="confirmPassword" value="Confirmar contraseña" />
            <TextInput
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="mt-1"
              placeholder="Confirma tu contraseña"
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={loading}
            gradientDuoTone="purpleToPink"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <Spinner size="sm" className="mr-2" />
                Cargando...
              </div>
            ) : (
              "Registrarse"
            )}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          ¿Ya tienes una cuenta?{" "}
          <Link
            href="/login"
            className="font-medium text-blue-500 hover:underline"
          >
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
