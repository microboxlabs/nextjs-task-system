import { useEffect, useState } from "react";
import { Group, Task, User } from "@/types";
import { useAuth } from "@/context/AuthContext";
import CustomSelect from "../CustomSelect";
import axios from "axios";
import ReactDatePicker from "react-datepicker";
import LoadingButton from "../LoadingButton";
import { Modal } from "flowbite-react";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (user: User) => void;
}

const UserModal = ({ isOpen, onClose, onSubmit }: TaskModalProps) => {
  const { user, token } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [role, setRole] = useState("regular");
  const [roleSelect, setRoleSelect] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    try {
      e.preventDefault();
      setLoading(true);

      const newUser: User = {
        username,
        password,
        role,
      };

      // Llamar a la función onSubmit con la nueva tarea
      onSubmit(newUser);

      // Limpiar los campos del formulario
      setUsername("");
      setPassword("");
      setRole("regular");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal show={isOpen} onClose={onClose}>
      <Modal.Header>Agregar Usuario</Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Nombre de usuario
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <CustomSelect
            label="Asignar Rol"
            state={role}
            setState={setRole}
            values={["Regular", "Administrador"]}
            keyValues={["regular", "admin"]}
          />

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
              {loading ? <LoadingButton /> : "Agregar Tarea"}
            </button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default UserModal;
