'use client'

import React, { useEffect, useState } from 'react'
import { closestCorners, DndContext, DragEndEvent } from '@dnd-kit/core';
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

const BoardViewContainer = ({ tasks: initialTasks }: { tasks: Task[] }) => {
    const [tasks, setTasks] = useState<Task[]>(initialTasks || []);

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

    // Handle the end of a drag event, when a task has been dropped onto a new lane
    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        // If the task was not dropped over a valid lane, do nothing
        if (!over) return;

        // Get the current lane of the task
        const sourceLaneId = active.data.current?.laneId; 
        // Get the destination lane after the drag
        const destinationLaneId = over.data.current?.laneId;

        // If the task is dragged to the same lane, no update is necessary
        if (sourceLaneId === destinationLaneId) return;

        // Update the task status locally
        const updatedTasks = tasks.map((task) =>
            task.id === Number(active.id)
                ? { ...task, status: destinationLaneId as 'Pending' | 'In Progress' | 'Completed' }
                : task
        );

         // Update the state to reflect the new task order and status
        setTasks(updatedTasks);

         // Make an API request to update the task status on the backend
        await handleTaskUpdate(Number(active.id), destinationLaneId);
    };

    // Filter tasks by their current status
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

