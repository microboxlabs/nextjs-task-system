'use client'

import { useEffect, useState } from 'react';
import { Card, Button } from 'flowbite-react';
import { TaskModal } from './TaskModal';

type Priority = 'LOW' | 'MEDIUM' | 'HIGH';
type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'FINISHED';

type Task = {
    id: number
    title: string
    description: string
    status: TaskStatus
    user: { name: string}
    due_date: Date
    priority: Priority
    comments: string[]
}

export function DashBoard() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [showModal, setShowModal] = useState(false);

    const columns = ['PENDING', 'IN_PROGRESS', 'COMPLETED'] as const;

    const fetchTasks = async () => {
        const res = await fetch('/api/v1/tasks')
        const data = await res.json()
        console.log(data)
        setTasks(data)
    }

    useEffect(() => {
        fetchTasks()
    }, [showModal])

    const openModal = (task: Task) => {
        setSelectedTask(task)
        setShowModal(true)
    }

    const closeModal = () => {
        setShowModal(false)
        setSelectedTask(null)
    }

    return (
        <div className="m-auto mt-6 flex w-[90%] flex-col gap-4 md:flex-row">
            {columns.map((column) => (
                <div key={column} className="flex-1">
                    <h3 className="mb-2 text-lg font-semibold capitalize">{column.replace('-', ' ')}</h3>
                    <div className="h-full rounded-lg bg-gray-200 p-4">
                        {tasks
                            .filter((task) => task.status === column)
                            .map((task) => (
                                <Card key={task.id} className="mb-3">
                                    <h5 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
                                        {task.title}
                                    </h5>
                                    {/* <p className="font-normal text-gray-700 dark:text-gray-400">
                                        {task.description}
                                    </p> */}
                                    <Button onClick={() => openModal(task)}>Ver más</Button>
                                </Card>
                            ))}
                    </div>
                </div>
            ))}
            <TaskModal task={selectedTask} showModal={showModal} onClose={closeModal} />
        </div>
    )
}

