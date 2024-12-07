import { Task } from "@/types";
import axios from "axios";
import { Modal } from "flowbite-react";

interface TaskDetailsProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
}

const TaskDetails = ({ task, isOpen, onClose }: TaskDetailsProps) => {
  const {
    title,
    description,
    assigned_user,
    assigned_group,
    due_date,
    priority,
    status,
    comments,
  } = task;

  console.log("que trae task en details: " + JSON.stringify(task));

  return (
    <Modal show={isOpen} onClose={onClose}>
      <Modal.Header>{title}</Modal.Header>
      <Modal.Body>
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-500">Descripción</h3>
          <p className="text-gray-700">{description}</p>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Asignado a</h3>
            <p className="text-gray-700">
              {/* Mostrar si está asignado a un usuario o grupo */}
              {assigned_user ? assigned_user : assigned_group}
            </p>
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
        {comments && (
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-500">Comentarios</h3>
            <p className="text-gray-700">{comments}</p>
          </div>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default TaskDetails;
