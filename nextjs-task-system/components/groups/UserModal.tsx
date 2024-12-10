import { useEffect, useState } from "react";
import { Group, User } from "@/types";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import LoadingButton from "../LoadingButton";
import { Modal } from "flowbite-react";
import CustomSelect from "../CustomSelect";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (group: Group) => void;
}

const GroupModal = ({ isOpen, onClose, onSubmit }: TaskModalProps) => {
  const { token } = useAuth();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  // Usuarios disponibles y seleccionados
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  // Cargar usuarios al abrir el modal
  useEffect(() => {
    if (!isOpen) return;

    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [isOpen, token]);

  const handleSubmit = (e: React.FormEvent) => {
    try {
      e.preventDefault();
      setLoading(true);

      const newGroup: Group = {
        name,
        user_ids: selectedUsers.map((user) => Number(user.id)), // IDs de los usuarios seleccionados
      };

      onSubmit(newGroup);

      // Limpiar los campos del formulario
      setName("");
      setSelectedUsers([]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectUser = (user: User) => {
    if (!selectedUsers.find((u) => u.id === user.id)) {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const handleRemoveUser = (userId: number) => {
    setSelectedUsers(selectedUsers.filter((user) => user.id !== userId));
  };

  if (!isOpen) return null;

  return (
    <Modal show={isOpen} onClose={onClose}>
      <Modal.Header>Agregar Grupo</Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Nombre del Grupo
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="users"
              className="block text-sm font-medium text-gray-700"
            >
              Usuarios
            </label>

            <select
              id="users"
              onChange={(e) => {
                const userId = parseInt(e.target.value);
                const user = users.find((u) => u.id === userId);
                if (user) handleSelectUser(user);
              }}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Seleccionar usuario</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.username}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Usuarios seleccionados
            </label>
            <div className="mt-2 flex flex-wrap gap-2">
              {selectedUsers.map((user) => (
                <span
                  key={user.id}
                  className="flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800"
                >
                  {user.username}
                  <button
                    type="button"
                    onClick={() => handleRemoveUser(user.id!)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md bg-gray-300 px-4 py-2 text-gray-700"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-md bg-blue-500 px-4 py-2 text-white"
            >
              {loading ? <LoadingButton /> : "Agregar Grupo"}
            </button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default GroupModal;
