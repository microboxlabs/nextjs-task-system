import { useState } from "react";
import { Modal } from "flowbite-react";
import axios from "axios";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmDeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
}: ConfirmDeleteModalProps) => {
  console.log("mostrando modal delete");
  return (
    <Modal show={isOpen} onClose={onClose}>
      <Modal.Header>Confirmar Eliminación</Modal.Header>
      <Modal.Body>
        <p className="text-gray-700">
          ¿Estás seguro de que deseas eliminar esta tarea? Esta acción no se
          puede deshacer.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <button
          onClick={onConfirm}
          className="rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600"
        >
          Sí, eliminar
        </button>
        <button
          onClick={onClose}
          className="rounded-md bg-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-400"
        >
          Cancelar
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmDeleteModal;
