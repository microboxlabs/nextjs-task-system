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
  onSubmit: (task: Task) => void;
}

const TaskModal = ({ isOpen, onClose, onSubmit }: TaskModalProps) => {
  const { user, token } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Pendiente");
  const [priority, setPriority] = useState("Alta");
  const [userSelect, setUserSelect] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [isGroup, setIsGroup] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getUsers();
    getGroups();
  }, []);

  useEffect(() => {
    if (isGroup && userSelect === "") {
      setUserSelect(JSON.stringify(groups[0].id));
    }
  }, [isGroup, userSelect]);

  const getUsers = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers(response.data);
      setUserSelect(JSON.stringify(response.data[0].id));
    } catch (error) {}
  };

  const getGroups = async () => {
    try {
      const response = await axios.get("/api/groups", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.groups.length === 0) {
        console.log("No hay grupos disponibles.");
        // Mostrar un mensaje adecuado en la interfaz
        setGroups([]); // O mostrar un mensaje a los usuarios
      } else {
        setGroups(response.data.groups);
      }
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    try {
      e.preventDefault();
      setLoading(true);

      // Formatear la fecha de entrega
      const formattedDate = dueDate ? dueDate.toISOString().split("T")[0] : "";
      const created_date = new Date().toISOString().split("T")[0];

      const newTask: Task = {
        title,
        description,
        assigned_to: !isGroup
          ? Number(userSelect)
          : { type: "group", id: Number(userSelect) }, //userSelect traería el id del grupo
        due_date: formattedDate,
        created_date,
        priority,
        status,
        comments: "",
      };

      // Llamar a la función onSubmit con la nueva tarea
      onSubmit(newTask);

      // Limpiar los campos del formulario
      setTitle("");
      setDescription("");
      setStatus("Pendiente");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal show={isOpen} onClose={onClose}>
      <Modal.Header>Agregar Tarea</Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Título
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Descripción
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="enable-selects"
              checked={isGroup}
              onChange={() => {
                setIsGroup(!isGroup);
              }}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label
              htmlFor="enable-selects"
              className="ml-2 text-sm font-medium text-gray-700"
            >
              Asignar la tarea a un Grupo
            </label>
          </div>

          <CustomSelect
            label={`Selecciona un ${isGroup ? "Grupo" : "Usuario"}`}
            state={userSelect}
            setState={setUserSelect}
            values={
              isGroup
                ? groups.map((group) => group.name)
                : users.map((user) => user.username)
            }
            keyValues={
              isGroup
                ? groups.map((group) => JSON.stringify(group.id))
                : users.map((user) => JSON.stringify(user.id))
            }
          />
          <CustomSelect
            label="Prioridad"
            state={priority}
            setState={setPriority}
            values={["Alta", "Media", "Baja"]}
            keyValues={["Alta", "Media", "Baja"]}
          />
          <div className="mb-4">
            <label
              htmlFor="due-date"
              className="block text-sm font-medium text-gray-700"
            >
              Fecha de Entrega
            </label>
            <ReactDatePicker
              id="due-date"
              selected={dueDate}
              onChange={(date) => setDueDate(date)}
              dateFormat="dd/MM/yyyy"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholderText="Selecciona una fecha"
              isClearable
            />
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
              {loading ? <LoadingButton /> : "Agregar Tarea"}
            </button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default TaskModal;
