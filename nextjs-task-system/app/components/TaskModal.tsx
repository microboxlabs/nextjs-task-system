import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Modal, Select } from 'flowbite-react';
import axios from 'axios';
import dayjs from 'dayjs';

import { Task, Priority } from '../types';
import { AddComments } from './AddComments';

interface TaskModalProps {
  task: Task | null
  showModal: boolean
  onClose: () => void
}

const getPriorityColor = (priority: Priority) => {
  switch (priority) {
    case 'LOW':
      return 'bg-green-100 text-green-800'
    case 'MEDIUM':
      return 'bg-yellow-100 text-yellow-800'
    case 'HIGH':
      return 'bg-red-100 text-red-800'
  }
}

export const TaskModal = ({ task, showModal, onClose }: TaskModalProps) => {
  if (!task) return null

  const handleStatusChange = async(e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = await axios.put(`/api/v1/tasks/${task.id}`, { status: e.target.value })
    if (newStatus) {
      onClose()
    }
  }

  return (
    <Modal show={showModal} onClose={onClose}>
      <Modal.Header>Task Details</Modal.Header>
      <Modal.Body>
        <div className="space-y-4">
          <h3 className="text-xl font-bold">{task?.title}</h3>
          <p>{task?.description}</p>
          <div className="flex justify-between">
            <span className="font-semibold">Status:</span>
            <Select id="status" value={task?.status} onChange={handleStatusChange} className="w-1/2">
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </Select>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Assigned to:</span>
            <span>{task?.user.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Due date:</span>
            <span>{dayjs(task?.due_date).format('MMMM DD, YYYY')}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Priority:</span>
            <span className={`rounded px-2.5 py-0.5 text-xs font-semibold ${task?.priority ? getPriorityColor(task.priority) : ''}`}>
              {task?.priority}
            </span>
          </div>
          <div>
            <AddComments taskId={task.id} />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  )
}

