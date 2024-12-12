import { Button, Modal } from "flowbite-react";
import { Form } from "./form";

interface ModalFormProps {
    openModal: boolean;
    setOpenModal: (value: boolean) => void;
}

export function ModalForm({ openModal, setOpenModal }: ModalFormProps) {
    const handleClose = () => setOpenModal(false);

    return (
        <Modal show={openModal} onClose={handleClose}>
            <Modal.Header>Create Task</Modal.Header>
            <Modal.Body>
                <div className="space-y-6">
                    <Form />
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={handleClose}>Accept</Button>
                <Button color="gray" onClick={handleClose}>
                    Cancel
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
