import { HiPencil, HiTrash } from "react-icons/hi";
import { useTaskContext } from "@/context/TaskContext"; // Importa el hook del contexto
import { ResponseTaskGet, Task } from "@/types/tasks-types";
import ModalUpdateTask from "../modals/modalUpdateTask";
import { ModalDeleteTask } from "../modals/modalDeleteTask";
import ModalViewTask from "../modals/modalViewTask";
import { useGlobalContext } from "@/context/GlobalContext";
import { User } from "@/types/global-types";
interface props {
  task: Task;
  setShowToast: React.Dispatch<
    React.SetStateAction<{
      show: boolean;
      message: string;
      icon: "alert" | "warning" | "success" | "";
    }>
  >;
  setTasksData: React.Dispatch<React.SetStateAction<ResponseTaskGet>>;
}

export default function Card({ task, setShowToast, setTasksData }: props) {
  const userLogged: User = useGlobalContext();

  const {
    setTaskForModal,
    setShowModal,
    setIdForDelete,
    setShowDeleteModal,
    setViewModal,
  } = useTaskContext();

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setTaskForModal({ task: task });
    setShowModal(true);
  };

  const handleDeleteClick = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setIdForDelete(id);
    setShowDeleteModal(true);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setTaskForModal({ task: task });
    setViewModal(true);
  };

  return (
    <>
      <div
        onClick={handleCardClick}
        className="cursor-pointer rounded bg-white p-3 shadow hover:border-2 hover:border-sky-500 dark:bg-gray-700"
      >
        <div className="flex items-center justify-between">
          <h3 className="font-medium">{task.title}</h3>
          {userLogged.rol === 1 && (
            <div className="flex gap-3">
              <HiPencil
                onClick={handleEditClick}
                className="cursor-pointer text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
                size={30}
              />
              <HiTrash
                onClick={(e) => handleDeleteClick(e, task.id)}
                className="cursor-pointer text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
                size={30}
              />
            </div>
          )}
        </div>

        <p className="text-sm text-gray-500">
          Assigned to: {task.user == null ? task.group?.name : task.user.name}
        </p>
        <p className="text-sm text-gray-500">
          Creation Date:{" "}
          {new Date(task.creationDate).toISOString().split("T")[0]}
        </p>
        <p className="text-sm text-gray-500">
          Due Date: {new Date(task.dueDate).toISOString().split("T")[0]}
        </p>
        <p className="text-sm text-gray-500">Priority: {task.priority.name}</p>
      </div>

      <ModalUpdateTask
        setShowToast={setShowToast}
        setTasksData={setTasksData}
      />
      <ModalDeleteTask
        setShowToast={setShowToast}
        setTasksData={setTasksData}
      />
      <ModalViewTask setTasksData={setTasksData} setShowToast={setShowToast} />
    </>
  );
}
