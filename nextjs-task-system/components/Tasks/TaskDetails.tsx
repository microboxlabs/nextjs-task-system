import { Task, User } from "@/types";
import { Modal } from "flowbite-react";
import { useState } from "react";
import TaskModal from "./TaskModal";

interface TaskDetailsProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  user: User; // Propiedad para verificar el rol del usuario
  onCommentSubmit: (comment: string) => void; // Función para enviar comentario
  updateTask: (task: Task) => void;
}

const TaskDetails = ({
  task,
  isOpen,
  onClose,
  user,
  onCommentSubmit,
  updateTask,
}: TaskDetailsProps) => {
  const {
    title,
    description,
    assigned_name,
    due_date,
    created_date,
    priority,
    status,
    comments,
  } = task;

  const [newComment, setNewComment] = useState<string>("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); //abrir editor de tareas

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewComment(e.target.value);
  };

  const handleCommentSubmit = () => {
    if (newComment.trim()) {
      onCommentSubmit(`${user.username}: ${newComment}`);
      setNewComment("");
    }
  };

  return (
    <Modal show={isOpen} onClose={onClose} dismissible>
      <Modal.Header>{title}</Modal.Header>
      <Modal.Body>
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-500">Descripción</h3>
          <p className="text-gray-700">{description}</p>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Asignado a</h3>
            <p className="text-gray-700">{assigned_name}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Prioridad</h3>
            <span
              className={`inline-block rounded-full px-3 py-1 text-sm font-medium text-white ${
                priority === "Alta"
                  ? "bg-red-500"
                  : priority === "Media"
                    ? "bg-yellow-500"
                    : "bg-green-500"
              }`}
            >
              {priority}
            </span>
          </div>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">
              Fecha de Entrega
            </h3>
            <p className="text-gray-700">{due_date}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">
              Fecha de Creación
            </h3>
            <p className="text-gray-700">{created_date}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Estado</h3>
            <span
              className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${
                status === "Pendiente"
                  ? "bg-gray-500 text-white"
                  : status === "En progreso"
                    ? "bg-blue-500 text-white"
                    : "bg-green-500 text-white"
              }`}
            >
              {status}
            </span>
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer>
        {user.role === "admin" && comments && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-500">Comentarios</h3>
            <p className="text-gray-700">{comments}</p>
          </div>
        )}

        {user.role === "regular" && (
          <div className="mt-6 w-full">
            {/* Comentarios previos arriba */}
            {comments && (
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-500">
                  Comentario Previo
                </h3>
                <p className="text-gray-700">{comments}</p>
              </div>
            )}

            {/* Caja de texto para nuevo comentario */}
            <textarea
              className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="Escribe un comentario..."
              value={newComment}
              onChange={handleCommentChange}
            />

            {/* Botón para enviar el comentario */}
            <button
              onClick={handleCommentSubmit}
              className="mt-4 w-full rounded-md bg-blue-500 py-2 text-white hover:bg-blue-600"
            >
              Enviar Comentario
            </button>
          </div>
        )}

        {user.role === "admin" && (
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            Editar Tarea
          </button>
        )}
      </Modal.Footer>

      {/* Modal de edición */}
      <TaskModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={updateTask}
        task={task} // Pasa la tarea actual para precargar los campos
      />
    </Modal>
  );
};

export default TaskDetails;
