import { useState, useEffect } from 'react';
import { User } from '@/types/users';

interface UseUsersReturn {
  users: User[];
  loading: boolean;
  error: string | null;
  handleCreateUser: (userData: User) => Promise<void>;
}

export function useUsers(): UseUsersReturn {
  const [users, setUsers] = useState<User[]>([]); // Estado para los usuarios
  const [loading, setLoading] = useState<boolean>(true); // Estado de carga
  const [error, setError] = useState<string | null>(null); // Estado de error

  async function fetchUsers() {
    try {
      setLoading(true); // Iniciar la carga
      const response = await fetch('/api/admin/user');

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data: User[] = await response.json();

      // Validar el formato de los datos
      if (Array.isArray(data)) {
        setUsers(data);
      } else {
        throw new Error('Formato de datos inesperado');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Error desconocido');
      }
      console.error('Error al obtener usuarios:', err);
    } finally {
      setLoading(false); // Finalizar la carga
    }
  }

  const handleCreateUser = async (userData: User) => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        alert("User created successfully");
      } else {
        const errorResponse = await response.json();
        console.error(errorResponse);
        alert("Failed to create user");
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      alert("An unexpected error occurred while trying to create the user.");
    } finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return { users, loading, error, handleCreateUser };
}