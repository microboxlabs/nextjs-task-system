'use client'

import { useEffect, useState } from 'react';
import { Card, Button } from 'flowbite-react';
import { TaskModal } from './TaskModal';
import { Task, User } from '../types';

export function GroupDashboard({ groupId }: { groupId: string }) {
    const [user, setUser] = useState<User | null>(null);
    const [group, setGroup] = useState(groupId);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [showModal, setShowModal] = useState(false);

    const columns = ['PENDING', 'IN_PROGRESS', 'COMPLETED'] as const;

    useEffect(() => {
        if (groupId) {
            return
        } else {
            const fetchUser = async () => {
                try {
                    const response = await fetch("/api/v1/me");
                    const data = await response.json();
                    setUser(data);
                } catch (error) {
                    console.error("Error fetching user:", error);
                }
            };
            fetchUser();
        }
    }, []);

    useEffect(() => {
        if (user?.role === 'USER') {
            fetchGroup()
        } else {
            fetchTasks()
        }
    }, [user, showModal])

    useEffect(() => {
        if (group) {
            fetchTaskByGroupId(group)
        }
    }, [group])


    const fetchGroup = async () => {
        const res = await fetch(`/api/v1/users/${user?.id}`)
        const data = await res.json()
        setGroup(data.groups[0].groupId);
    }

    const fetchTasks = async () => {
        const res = await fetch('/api/v1/tasks')
        const data = await res.json()
        console.log(data)
        setTasks(data)
    }

    const fetchTaskByGroupId = async (groupId: string) => {
        const res = await fetch(`/api/v1/groups/${groupId}`)
        const data = await res.json()
        console.log(data.tasks)
        setTasks(data.tasks)
    }

    // useEffect(() => {
    //     fetchTasks()
    // }, [showModal])

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

