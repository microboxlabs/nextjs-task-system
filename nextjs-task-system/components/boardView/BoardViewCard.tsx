import { useDraggable } from '@dnd-kit/core';
import { CSS } from "@dnd-kit/utilities";
import React from 'react'

type BoardViewCardProps = {
    id: number;
    title: string;
    priority: string;
    description: string;
    status: 'Pending' | 'In Progress' | 'Completed';
}

export const BoardViewCard = ({ id, title, priority, description, status }: BoardViewCardProps) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: id, 
        data: {
            laneId: status, 
        },
    });

    const style = transform ? {
        transform: CSS.Translate.toString(transform),
    } : undefined;

    return (
        <div
            ref={setNodeRef} 
            style={style}
            {...listeners}
            {...attributes}
            className='bg-white p-4 rounded-md shadow-lg flex flex-col gap-2 border border-gray-200 hover:shadow-xl transition-shadow'
        >
            <p className="font-semibold">{title}</p>
            <span></span>
            <p className="text-sm text-gray-600">{description}</p>
            <div className="flex justify-between items-center pt-4">
                <span
                    className={`text-sm px-2 py-1 rounded ${priority === 'High'
                        ? 'bg-red-500 text-white'
                        : priority === 'Medium'
                            ? 'bg-yellow-400 text-black'
                            : 'bg-green-400 text-black'
                        }`}
                >
                    {priority || 'Low'}
                </span>
                <span
                    className={`text-sm px-2 py-1 rounded ${status === 'Completed'
                        ? 'bg-green-500 text-white'
                        : status === 'In Progress'
                            ? 'bg-blue-400 text-white'
                            : 'bg-gray-400 text-white'
                        }`}
                >
                    {status}
                </span>
            </div>
        </div>
    )
}