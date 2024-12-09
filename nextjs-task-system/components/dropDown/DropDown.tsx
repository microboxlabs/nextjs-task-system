import { Dropdown } from 'flowbite-react';
import { EditTasks } from '../EditTasks';
import { useState } from 'react';
import { Modal } from "flowbite-react";

export function DropDown({ task }: { task: number }) {
  const [isEditModalOpen, setEditModalOpen] = useState(false);

  const onDelete = async () => {
    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete task');
      }

      alert('Task deleted successfully');
      // Optionally, refresh the tasks list or update the state after deletion
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error deleting task:', error);
        alert(error.message);
      }
    }
  };

  return (
    <>
      <Dropdown
        className="z-0 px-2 "
        label="..."
        dismissOnClick={false}
        renderTrigger={() => <span className='cursor-pointer'>...</span>}
      >
        <Dropdown.Item onClick={() => setEditModalOpen(true)}>Edit</Dropdown.Item>
        <Dropdown.Item onClick={onDelete}>Delete</Dropdown.Item>
      </Dropdown>

      <Modal show={isEditModalOpen} onClose={() => setEditModalOpen(false)}>
        <EditTasks task={task} setEditModalOpen={setEditModalOpen} />
      </Modal>

    </>
  );
}
