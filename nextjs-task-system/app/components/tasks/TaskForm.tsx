"use client";

import { useState, useEffect } from "react";

interface User {
  id: number;
  email: string;
}

interface Group {
  id: number;
  name: string;
}

interface Task {
  id?: number;
  title: string;
  description: string;
  priority: "Low" | "Medium" | "High";
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  dueDate: string;
  userId?: number | null;
  groupId?: number | null;
}

interface TaskFormProps {
  onClose: () => void;
  initialData: Task | null;
  onSubmit: (task: Task) => Promise<void>;
  users: User[];
  groups: Group[];
}

export const TaskForm: React.FC<TaskFormProps> = ({
  onClose,
  initialData,
  onSubmit,
  users,
  groups,
}) => {
  const [formData, setFormData] = useState<Task>({
    title: "",
    description: "",
    priority: "Low",
    status: "PENDING",
    dueDate: "",
    userId: null,
    groupId: null,
  });

  const [error, setError] = useState<Record<string, string | null>>({
    title: null,
    description: null,
    dueDate: null,
    global: null, // Error global
  });

  // Cargar datos iniciales si están disponibles
  useEffect(() => {
    if (initialData) {
      setFormData({ ...initialData });
    }
  }, [initialData]);

  // Manejar cambios en los campos del formulario
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "userId" || name === "groupId" ? parseInt(value) || null : value,
    }));
  };

  // Validar el formulario antes de enviarlo
  const validateForm = (): boolean => {
    const newError: Record<string, string | null> = {
      title: formData.title ? null : "Title is required.",
      description: formData.description ? null : "Description is required.",
      dueDate: formData.dueDate ? null : "Due date is required.",
      global: null, // Reiniciar el error global al validar
    };

    setError(newError);
    return !Object.values(newError).some((val) => val !== null);
  };

  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await onSubmit(formData);
      onClose(); // Cerrar el formulario tras un envío exitoso
    } catch (err) {
      console.error("Error submitting task:", err);
      setError((prev) => ({
        ...prev,
        global: "An error occurred while saving the task. Please try again.",
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded bg-gray-100 p-4 shadow-md">
      <h2 className="mb-4 text-lg font-bold">
        {initialData ? "Edit Task" : "Create Task"}
      </h2>

      {/* Mostrar errores */}
      {Object.values(error).map(
        (err, index) => err && <p key={index} className="mb-4 text-red-500">{err}</p>
      )}

      {/* Campo: Título */}
      <div className="mb-4">
        <label htmlFor="title" className="block text-sm font-medium">
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          value={formData.title}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded border-gray-300"
          required
        />
      </div>

      {/* Campo: Descripción */}
      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded border-gray-300"
          required
        />
      </div>

      {/* Campos: Prioridad, Estado y Fecha de Entrega */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="mb-4">
          <label htmlFor="priority" className="block text-sm font-medium">
            Priority
          </label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded border-gray-300"
            required
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="status" className="block text-sm font-medium">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded border-gray-300"
            required
          >
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="dueDate" className="block text-sm font-medium">
            Due Date
          </label>
          <input
            id="dueDate"
            name="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded border-gray-300"
            required
          />
        </div>
      </div>

      {/* Campos: Usuario y Grupo */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="mb-4">
          <label htmlFor="userId" className="block text-sm font-medium">
            Assign to User
          </label>
          <select
            id="userId"
            name="userId"
            value={formData.userId || ""}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded border-gray-300"
          >
            <option value="">Unassigned</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.email}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="groupId" className="block text-sm font-medium">
            Assign to Group
          </label>
          <select
            id="groupId"
            name="groupId"
            value={formData.groupId || ""}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded border-gray-300"
          >
            <option value="">No Group</option>
            {groups.map((group) => (
              <option key={group.id} value={group.id}>
                {group.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Botones */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onClose}
          className="rounded bg-gray-200 px-4 py-2 text-gray-600"
        >
          Cancel
        </button>
        <button type="submit" className="rounded bg-blue-500 px-4 py-2 text-white">
          Save
        </button>
      </div>
    </form>
  );
};
