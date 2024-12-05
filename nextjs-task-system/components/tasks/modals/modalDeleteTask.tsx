
"use client";

import { deleteTask } from "@/actions/tasks/task-actions";
import { useTaskContext } from "@/context/TaskContext";
import { ResponseTaskGet } from "@/types/tasks-types";
import { Button, Modal } from "flowbite-react";
import { useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
interface Props {
    setTasksData: React.Dispatch<React.SetStateAction<ResponseTaskGet>>;
    setShowToast: React.Dispatch<React.SetStateAction<{ show: boolean, message: string, icon: 'alert' | 'warning' | 'success' | '' }>>
}
export function ModalDeleteTask({ setTasksData, setShowToast }: Props) {
    const { showDeleteModal, setShowDeleteModal, idForDelete } = useTaskContext();

    return (
        <>

            <Modal show={showDeleteModal} size="md" onClose={() => setShowDeleteModal(false)} popup>
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                            Are you sure you want to delete this task ?
                        </h3>
                        <div className="flex justify-center gap-4">
                            <form action={async () => {
                                const response = await deleteTask(idForDelete)
                                setShowDeleteModal(false)
                                setShowToast({ message: response.message, icon: response.status == 200 ? "success" : "warning", show: true })
                                if (response.status === 200) {
                                    setTasksData(prevData => ({
                                      ...prevData,
                                      data: prevData?.data.filter(task => task.id !== idForDelete) // Filtra la tarea con el id para eliminarla
                                    }));
                                }
                            }}>
                            <Button color="failure" type="submit">
                                {"Yes, I'm sure"}
                            </Button>
                            </form>
                            <Button color="gray" onClick={() => setShowDeleteModal(false)}>
                                No, cancel
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
}
