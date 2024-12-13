import { Button, Modal } from "flowbite-react";
import { Form } from "./form";
import { FaTrashAlt  } from "react-icons/fa";

interface ModalFormProps {
    openModal: boolean;
    setOpenModal: (value: boolean) => void;
}

export function ModalDelete({ openModal, setOpenModal }: ModalFormProps) {
    const handleClose = () => setOpenModal(false);

    return (
        <Modal show={openModal} onClose={handleClose}>
            <Modal.Body>
                <div className="space-y-6 flex gap-4">
                <FaTrashAlt  size={20} color="#C04242"/>
                Are you sure you want to delete this task?
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
