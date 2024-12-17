import { Button, Modal } from "flowbite-react";
import { FaTrashAlt } from "react-icons/fa";
import { useContext } from "react";
import { TaskContexts } from "../contexts/taskContexts";
import { useState } from "react";
import { Notification } from "./toast";

interface ModalFormProps {
    openModal: boolean;
    setOpenModal: (value: boolean) => void;
    task: any;
}

export function ModalDelete({ openModal, setOpenModal, task }: ModalFormProps) {
    const { deleteTask, getTasks, state } = useContext(TaskContexts);
    const [showNotification, setShowNotification] = useState(false);
    const [error, setError] = useState(false);


    const handleClose = () => setOpenModal(false);

    const handleDeletedTask = async () => {
        try {
            await deleteTask(task.id);
            setShowNotification(true);
            getTasks();
            setError(false);
        } catch (error) {
            console.error("Error deleting task:", error);
            setError(true);
        } finally {
            handleClose();
            setTimeout(() => setShowNotification(false), 3000);
        }
    };

    return (
        <>
            <Modal show={openModal} onClose={handleClose}>
                <Modal.Body>
                    <div className="space-y-6 flex gap-4">
                        <FaTrashAlt size={20} color="#C04242" />
                        Are you sure you want to delete this task?
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleDeletedTask}>Accept</Button>
                    <Button color="gray" onClick={handleClose}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
            {showNotification && (
                <Notification text={state.msg} successfullyAction={!error} />
            )}
        </>
    );
}
