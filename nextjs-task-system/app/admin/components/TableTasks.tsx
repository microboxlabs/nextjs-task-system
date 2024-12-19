'use client'
import { Table, Badge, Button } from 'flowbite-react'
import { filterTasks, getStatusColor } from '@/utils/helpers'
import { useState, useEffect } from 'react'
import { Task } from '@/types/task'
import { formatDate } from '@/utils/helpers'

interface TableTasksProps {
    onRowClick: (task: Task) => void;
    onDelete: (id: number) => void;
    filters: { [key: string]: string };
    tasks: Task[];
}

export default function TableTasks({ onRowClick, filters, tasks, onDelete }: TableTasksProps) {
    const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);

    useEffect(() => {
        // Aplicar filtros localmente
        let filtered = filterTasks(tasks, filters);
        setFilteredTasks(filtered);
        
    }, [filters, tasks]);

    return (
        <Table hoverable className='mb-3'>
            <Table.Head>
                <Table.HeadCell className="px-2">Title</Table.HeadCell>
                <Table.HeadCell className="px-1">Due Date</Table.HeadCell>
                <Table.HeadCell className="px-1">Priority</Table.HeadCell>
                <Table.HeadCell className="px-1 sm:px-6">Status</Table.HeadCell>
                <Table.HeadCell className="px-1 sm:px-6"></Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
                {filteredTasks && filteredTasks.length > 0 ?
                    filteredTasks.map(t =>
                        <Table.Row key={t.id} onClick={() => onRowClick(t)} className="text-xs sm:text-sm bg-white dark:border-gray-700 dark:bg-gray-800 cursor-pointer">
                            <Table.Cell className="px-1 sm:px-3 whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                <p>{t.title}</p>
                                <p className='dark:text-gray-400 font-bold'>{t.assignedTo}</p>
                            </Table.Cell>
                            <Table.Cell className="px-1 text-xs sm:text-sm">{formatDate(t.dueDate)}</Table.Cell>
                            <Table.Cell className="px-1 text-xs sm:text-sm">{t.priority}</Table.Cell>
                            <Table.Cell className="px-1 text-xs sm:text-sm"><Badge className='flex justify-center max-w-24' color={getStatusColor(t.status)}>{t.status}</Badge></Table.Cell>
                            <Table.Cell className="px-1 text-xs sm:text-sm">
                                <Button onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                    e.stopPropagation();
                                    onDelete(t.id)
                                }} size='xs' className='rounded-full px-0 scale-[80%] md:scale-100'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M14 11v6m-4-6v6M6 7v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7M4 7h16M7 7l2-4h6l2 4"></path></svg>
                                </Button>
                            </Table.Cell>
                        </Table.Row>
                    )
                    :
                    <Table.Row className='text-xs sm:text-sm bg-white dark:border-gray-700 dark:bg-gray-800'>
                        {["No tasks found", "", "", "", ""].map((content, index) => (
                            <Table.Cell key={index}>{content}</Table.Cell>
                        ))}
                    </Table.Row>
                }
            </Table.Body>
        </Table>
    )
}