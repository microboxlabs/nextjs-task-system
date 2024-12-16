import { Button, Modal } from "flowbite-react";
import { Form } from "./form";
import { TaskContexts } from "../contexts/taskContexts";
import { useContext, useState } from "react";
import { Notification } from "./toast";

interface ModalFormProps {
    openModal: boolean;
    setOpenModal: (value: boolean) => void;
    task: any;
}

export function ModalForm({ openModal, setOpenModal, task }: ModalFormProps) {
    const [showNotification, setShowNotification] = useState(false);
    const { state, getTasks, createTask, updateTask } = useContext(TaskContexts);
    const [error, setError] = useState(false);

    const handleClose = () => setOpenModal(false);

    const handleSubmitCreate = async (data: any) => {
        try {
            await createTask(data);
            setShowNotification(true);
            getTasks();
            setError(false);
        } catch (error) {
            console.error("Error creating task:", error);
            setError(true);
        } finally {
            handleClose();
            setTimeout(() => setShowNotification(false), 3000);
        }
    };

    const handleSubmitEdit = async (data: any) => {
        try {
            await updateTask(data);
            setShowNotification(true);
            getTasks();
            setError(false);
        } catch (error) {
            console.error("Error updating task:", error);
            setError(true);
        } finally {
            handleClose();
            setTimeout(() => setShowNotification(false), 3000);
        }
    };



    return (
        <>
            <Modal show={openModal} onClose={handleClose}>
                <Modal.Header>{!task ? 'Create' : 'Edit'}  Task</Modal.Header>
                <Modal.Body>
                    <div className="space-y-6">
                        <Form initialData={task ? task : {}}
                            onSubmit={task ? (data) => handleSubmitEdit(data) 
                                           : (data) => handleSubmitCreate(data)} />
                    </div>
                </Modal.Body>
            </Modal>
            {showNotification && (
                <Notification text={state.msg} successfullyAction={!error} />
            )}
        </>
    );
}
