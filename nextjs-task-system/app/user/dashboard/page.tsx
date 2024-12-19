'use client'
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Badge, Spinner } from 'flowbite-react'
import CompleteTask from '../components/CompleteTask'
import { useState, useEffect } from 'react'
import { useUserTask } from '@/hooks/useUserTask';
import { filterTasks, formatDate, getStatusColor } from '@/utils/helpers';
import { Task } from '@/types/task';
import TaskFilter from '../components/TaskFilter';

export default function Dashboard() {
    const [isOpen, setIsOpen] = useState(false);
    const { tasks, loading, handleUpdateTask } = useUserTask();
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [filters, setFilters] = useState({
        status: '',
        priority: '',
        assignedTo: '',
        dueDate: '',
        creationDate: ''
    });
    const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);

    const handleClose = () => setIsOpen(false);
    const handleOpen = (task: Task) => {
        setSelectedTask(task)
        setIsOpen(true)
    };

    const handleFilterChange = (newFilters: { [key: string]: string }) => {
        setFilters({ ...filters, ...newFilters });
    };

    useEffect(() => {
        // Aplicar filtros localmente
        let filtered = filterTasks(tasks, filters);
        setFilteredTasks(filtered);
    }, [filters, tasks]);

    return (
        <>
            <div className='dark:text-white'>
                <h1 className="text-2xl font-bold text-center py-6">User Dashboard</h1>
                <div className="flex flex-col items-center">
                    <h2 className='px-3 text-lg max-w-6xl w-full font-semibold'>My Tasks</h2>
                    <div className='w-full max-w-6xl p-3'>
                        <TaskFilter filters={filters} onFilterChange={handleFilterChange} />
                    </div>
                    <div className="overflow-x-auto w-full px-3 flex justify-center">
                        <div className="max-w-6xl w-full">
                            {loading ?
                                <div className='w-full flex h-12 justify-center'>
                                    <Spinner aria-label="Spinner" size="xl" />
                                </div>
                                :
                                <Table hoverable className='mb-3'>
                                    <TableHead>
                                        <TableHeadCell className="px-2">Title</TableHeadCell>
                                        <TableHeadCell className="px-1">Due Date</TableHeadCell>
                                        <TableHeadCell className="px-1">Priority</TableHeadCell>
                                        <TableHeadCell className="px-1">Status</TableHeadCell>
                                    </TableHead>
                                    <TableBody className="divide-y">
                                        {filteredTasks && filteredTasks.length > 0 ?
                                            filteredTasks.map(t =>
                                                <TableRow key={t.id} onClick={() => handleOpen(t)} className="text-xs bg-white dark:border-gray-700 dark:bg-gray-800">
                                                    <TableCell className="px-1 sm:px-3 whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                                        <div className='flex flex-col'>
                                                            <p>{t.title}</p>
                                                            <p className='dark:text-gray-400 font-bold'>{t.assignedTo}</p>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="px-1 text-xs sm:text-sm">{formatDate(t.dueDate)}</TableCell>
                                                    <TableCell className="px-1 text-xs sm:text-sm">{t.priority}</TableCell>
                                                    <TableCell className="px-1 text-xs sm:text-sm flex items-center mt-2"><Badge color={getStatusColor(t.status)}>{t.status}</Badge></TableCell>
                                                </TableRow>
                                            )
                                            :
                                            <Table.Row className='text-xs sm:text-sm bg-white dark:border-gray-700 dark:bg-gray-800'>
                                                {["No tasks found", "", "", ""].map((content, index) => (
                                                    <Table.Cell key={index}>{content}</Table.Cell>
                                                ))}
                                            </Table.Row>
                                        }

                                    </TableBody>
                                </Table>}
                        </div>
                    </div>
                </div>
            </div>
            <CompleteTask isOpen={isOpen} handleClose={handleClose} task={selectedTask} fnUpdateTask={handleUpdateTask} />
        </>
    )
}