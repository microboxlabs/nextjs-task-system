import { HiPencil, HiTrash } from "react-icons/hi";
import { useTaskContext } from "@/context/TaskContext"; // Importa el hook del contexto
import { ResponseTaskGet, Task } from "@/types/tasks-types";
import ModalUpdateTask from "../modals/modalUpdateTask";
import { ModalDeleteTask } from "../modals/modalDeleteTask";


interface props {
    task: Task;
    setShowToast: React.Dispatch<React.SetStateAction<{ show: boolean; message: string; icon: 'alert' | 'warning' | 'success' | '' }>>;
    setTasksData: React.Dispatch<React.SetStateAction<ResponseTaskGet>>;
}

export default function Card({ task, setShowToast, setTasksData }: props) {
    const { setUpdateModal, setShowModal, setIdForDelete,setShowDeleteModal } = useTaskContext();

    const handleEditClick = () => {
        setUpdateModal({ task: task });
        setShowModal(true);
    };
    const handleDeleteClick = (id:number)=>{
        setIdForDelete(id)
        setShowDeleteModal(true)
    }   
    return (
        <>
            <div className="bg-white dark:bg-gray-700 rounded p-3 shadow">
                <div className="flex justify-between items-center">
                    <h3 className="font-medium">{task.title}</h3>
                    <div className="flex gap-3">

                        <HiPencil
                            onClick={handleEditClick}
                            className="text-gray-500 dark:text-gray-300 cursor-pointer hover:text-gray-700 dark:hover:text-white"
                            size={30}
                        />
                        <HiTrash
                            onClick={()=> {
                                handleDeleteClick(task.id)
                            }}
                            className="text-gray-500 dark:text-gray-300 cursor-pointer hover:text-gray-700 dark:hover:text-white"
                            size={30}
                        />
                    </div>
                </div>

                <p className="text-sm text-gray-500">
                    Assigned to: {task.user == null ? task.group?.name : task.user.name}
                </p>
                <p className="text-sm text-gray-500">Due: {task.dueDate.toLocaleString()}</p>
                <p className="text-sm text-gray-500">Priority: {task.priority.name}</p>
            </div>

            <ModalUpdateTask setShowToast={setShowToast} setTasksData={setTasksData} />
            <ModalDeleteTask setShowToast={setShowToast} setTasksData={setTasksData}  />
        </>
    );
};