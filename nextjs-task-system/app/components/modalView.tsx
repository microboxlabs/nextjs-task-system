import { Badge, Button, Card, Modal } from "flowbite-react";
import { Form } from "./form";

interface ModalFormProps {
    openModal: boolean;
    setOpenModal: (value: boolean) => void;
}

export function ModalView({ openModal, setOpenModal }: ModalFormProps) {
    const handleClose = () => setOpenModal(false);

    return (
        <Modal show={openModal} onClose={handleClose}>
            <Modal.Header className="h-10 p-2" ></Modal.Header>
            <Modal.Body>
                <div className="space-y-6">
                    <Card href="#" className="w-100">
                        <div className="flex w-100 justify-between">
                            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                Titulo tarea
                            </h5>
                            <Badge size="sm" color="info">Complete</Badge>
                        </div>

                        <p className="font-normal text-gray-700 dark:text-gray-400">
                            Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.
                        </p>
                        <p className="font-normal text-gray-700 dark:text-gray-400 flex gap-2">
                            Assigned To: <Badge size="sm" color="info">Usuario</Badge>
                        </p>
                        <p className="font-normal text-gray-700 dark:text-gray-400">
                            Due Date: 10/02/99
                        </p>
                        <p className="font-normal text-gray-700 dark:text-gray-400 flex gap-2">
                            Priority: <Badge size="sm" color="info">Low</Badge>
                        </p>
                    </Card>
                </div>
            </Modal.Body>

        </Modal>
    );
}
