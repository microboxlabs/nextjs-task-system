'use client'

import React, { useEffect, useState } from 'react'
import { closestCorners, DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import BoardViewLane from './BoardViewLane';
import { Spinner } from "flowbite-react";

type Task = {
    id: number;
    title: string;
    description?: string;
    status: 'Pending' | 'In Progress' | 'Completed';
    assignedTo: string;
    dueDate: string;
    priority: string;
};

const BoardViewContainer = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 5 },
        })
    );

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const res = await fetch('/api/tasks');
                if (!res.ok) throw new Error('Failed to fetch tasks');

                const data: Task[] = await res.json();
                setTasks(data);
            } catch (err: any) {
                setError(err.message || 'An unexpected error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, []);


    const handleTaskUpdate = async (taskId: number, updatedStatus: string) => {
        try {
            const response = await fetch(`/api/tasks/${taskId}`, {
                method: 'PUT',  
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: updatedStatus }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to update task: ${errorText}`);
            }

            const updatedTask = await response.json();
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        // Verifica que se haya soltado sobre un "droppable"
        if (!over) return;

        const sourceLaneId = active.data.current?.laneId;
        const destinationLaneId = over.data.current?.laneId;

        // Si se arrastra al mismo lane, no hagas nada
        if (sourceLaneId === destinationLaneId) return;

        // Actualiza el estado moviendo la tarea a la nueva lane
        setTasks((currentTasks) =>
            currentTasks.map((task) =>
                task.id === active.id
                    ? { ...task, status: destinationLaneId as 'Pending' | 'In Progress' | 'Completed' }
                    : task
            )
        );

        await handleTaskUpdate(Number(active.id), destinationLaneId);
    };

    if (loading) return <div className='text-center align-middle'>
        <Spinner aria-label="Loading data" />
    </div>;
    if (error) return <div>Error: {error}</div>;

    const pendingTasks = tasks.filter((task) => task.status === 'Pending');
    const inProgressTasks = tasks.filter((task) => task.status === 'In Progress');
    const completedTasks = tasks.filter((task) => task.status === 'Completed');

    return (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto p-6'>
            <DndContext
                collisionDetection={closestCorners}
                onDragEnd={handleDragEnd}
            >
                <BoardViewLane title="Pending" items={pendingTasks} laneId="Pending" />
                <BoardViewLane title="In Progress" items={inProgressTasks} laneId="In Progress" />
                <BoardViewLane title="Completed" items={completedTasks} laneId="Completed" />
            </DndContext>
        </div>
    )
}

export default BoardViewContainer

