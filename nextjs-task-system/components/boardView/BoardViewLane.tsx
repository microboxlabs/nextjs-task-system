import React from 'react'
import { BoardViewCard } from './BoardViewCard';
import { useDroppable } from '@dnd-kit/core';

type Task = {
    id: number;
    title: string;
    description?: string;
    status: 'Pending' | 'In Progress' | 'Completed';
    assignedTo: string;
    dueDate: string;
    priority: string;
};

type BoardViewLaneProps = {
    title: string;
    items: Task[];
    laneId: 'Pending' | 'In Progress' | 'Completed';
}

export default function BoardViewLane({ title, items, laneId }: BoardViewLaneProps) {
    const { setNodeRef } = useDroppable({
        id: laneId, // Identifica esta lane
        data: { laneId }, // Pasa el ID de la lane
    });
    
    return (
        <div
            ref={setNodeRef}
            className='flex flex-col bg-white shadow-md rounded-lg w-full'>
            <div className="p-4 border-b">
                <p className="font-bold">{title}</p>
            </div>
            <div className='flex flex-col gap-4 p-4'>
                {items.length === 0 ? (
                     <p className="text-center text-gray-500">No hay tareas disponibles.</p>
                ) : (
                    items.map((item) => (
                        <BoardViewCard
                            key={item.id}
                            id={item.id}
                            title={item.title}
                            priority={item.priority}
                            description={item.description || ''}
                            status={item.status}
                        />
                    ))
                )}
            </div>
        </div>
    )
}