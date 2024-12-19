'use client'
import { ForwardedMyButton } from '@/components/ButtonLink';
import { Spinner } from 'flowbite-react';
import Link from 'next/link';
import TableTasks from '../components/TableTasks';
import TaskDetails from '../components/TaskDetails';
import { useState } from 'react';
import { Task } from '@/types/task';
import TaskFilter from '../components/TaskFilter';
import { useTask } from '@/hooks/useTask';

export default function Dashboard() {
    const [isOpen, setIsOpen] = useState(false);
    const { tasks, handleDeleteTask, loading, handleSortChange } = useTask();
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [filters, setFilters] = useState({
        status: '',
        priority: '',
        assignedTo: '',
        dueDate: '',
        creationDate: ''
    });

    const handleClose = () => setIsOpen(false);
    const handleOpen = (task: Task) => {
        setSelectedTask(task);
        setIsOpen(true);
    }

    const handleFilterChange = (newFilters: { [key: string]: string }) => {
        setFilters({ ...filters, ...newFilters });
    };

    return (
        <>
            <div className='dark:text-white'>
                <h1 className="text-2xl font-bold text-center py-6">Admin Dashboard</h1>
                <div className="flex w-full justify-center gap-2.5">
                    <Link href={'/admin/createTask'}>
                        <ForwardedMyButton label='Create Task' />
                    </Link>
                    <Link href={'/admin/groups'}>
                        <ForwardedMyButton label='Groups' />
                    </Link>
                    <Link href={'/admin/createUser'}>
                        <ForwardedMyButton label='Create Users' />
                    </Link>
                </div>
                <div className="flex flex-col items-center p-3">
                    <h2 className='py-3 text-lg hidden'>Tasks</h2>
                    <TaskFilter filters={filters} onFilterChange={handleFilterChange} onSort={handleSortChange} />
                    <div className="overflow-x-auto w-full py-3 flex justify-center">
                        <div className="max-w-6xl w-full items-center">
                            {loading ?
                                <div className='w-full flex justify-center p-3'>
                                    <Spinner aria-label="Extra large spinner example" size="xl" />
                                </div>
                                :
                                <TableTasks filters={filters} onRowClick={handleOpen} tasks={tasks} onDelete={handleDeleteTask} />
                            }
                        </div>
                    </div>
                </div>
            </div>
            <TaskDetails isOpen={isOpen} handleClose={handleClose} task={selectedTask} />
        </>
    )
}