import { Badge, Button, Card, Modal } from "flowbite-react";
import { Form } from "./form";

interface ModalFormProps {
    openModal: boolean;
    setOpenModal: (value: boolean) => void;
    task: any;
}

export const getPriorityColor = (priority : string) => {
    switch (priority) {
        case 'low':
            return 'green';
        case 'medium':
            return 'yellow'; 
        case 'high':
            return 'red'; 
        default:
            return 'gray'; 
    }
};

export const getStatusColor = (status: string) => {
    switch (status) {
        case 'pending':
            return 'yellow';
        case 'in progress':
            return 'blue'; 
        case 'completed':
            return 'green';
        default:
            return 'gray'; 
    }
};

export function ModalView({ openModal, setOpenModal, task }: ModalFormProps) {
    
    const handleClose = () => {
        setOpenModal(false);
    } 

    return (
        <Modal show={openModal} onClose={handleClose}>
            <Modal.Header className="h-10 p-2" ></Modal.Header>
            <Modal.Body>
                <div className="space-y-6">
                    <Card href="#" className="w-100">
                        <div className="flex w-100 justify-between">
                            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                {task?.title}
                            </h5>
                            <Badge
                                size="sm"
                                color={getStatusColor(task?.status)}
                                className="uppercase"
                            >
                                {task?.status}
                            </Badge>
                        </div>

                        <p className="font-normal text-gray-700 dark:text-gray-400">
                            {task?.description}
                        </p>
                        <p className="font-normal text-gray-700 dark:text-gray-400 flex gap-2">
                            Assigned To:
                            <Badge size="sm" color="info" className="uppercase">
                                {task?.assigned_to || 'Unassigned'}
                            </Badge>
                        </p>
                        <p className="font-normal text-gray-700 dark:text-gray-400">
                            Due Date: {task?.due_date}
                        </p>
                        <p className="font-normal text-gray-700 dark:text-gray-400 flex gap-2">
                            Priority:
                            <Badge
                                size="sm"
                                color={getPriorityColor(task?.priority)}
                                className="uppercase"
                            >
                                {task?.priority}
                            </Badge>
                        </p>
                    </Card>
                </div>
            </Modal.Body>

        </Modal>
    );
}
