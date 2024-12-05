'use client'
import { useEffect, useState } from 'react';
import { Button, Modal } from 'flowbite-react';
import { HiViewBoards, HiTable, HiFilter, HiDocumentAdd } from 'react-icons/hi';
import ListViewTasks from './table/ListViewTasks';

import BoardViewTasks from './board/boardViewTasks';
import ModalFilters from './modals/modalFilters';
import ModalCreateTask from './modals/modalCreateTask';
import { ResponseTaskGet, ResponseTaskGetBackend, Task } from '@/types/tasks-types';
import Loading from '@/components/tasks/loading';

export const dynamic = 'force-dynamic'

export default function CustomNavbarWithFilters() {
    const [filtersOpen, setFiltersOpen] = useState<boolean>(false);
    const [activeView, setActiveView] = useState<string>('Board');
    const [createOpen, setCreateOpen] = useState<boolean>(false)
    const [tasksData, setTasksData] = useState<ResponseTaskGet>()
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const handleViewChange = (view: string) => setActiveView(view);
    useEffect(() => {
        const fetchData = async () => {
            const url = process.env.NEXT_PUBLIC_URL_PAGE + "/api/tasks/";
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });


            const responseData: ResponseTaskGetBackend = await response.json();

            const formattedTasks: Task[] = responseData.data.map((task): Task => ({
                id: task.id,
                title: task.title,
                status: task.status.name,
                user: task.user ? task.user.name : undefined,
                group: task.group ? task.group.name : undefined,
                dueDate: task.dueDate,
                priority: task.priority.name,
            }));

            setTasksData({ data: formattedTasks, message: responseData.message, status: responseData.status });
            setIsLoading(false);
        }

        fetchData();
    }, []);
    return (
        <div className="p-4">

            <div className="mb-4 flex  justify-between items-center  bg-gray-100 p-3 rounded shadow-md">

                <div className="flex  gap-4">
                    <Button
                        disabled={isLoading}
                        onClick={() => handleViewChange('Board')}
                        color={activeView === 'Board' ? 'gray' : 'primary'}
                        className={`flex items-center gap-2`}
                    >
                        <HiViewBoards className="size-5" />
                        Board
                    </Button>
                    <Button
                        disabled={isLoading}
                        onClick={() => handleViewChange('Table')}
                        color={activeView === 'Table' ? 'gray' : 'primary'}
                        className={`flex items-center gap-2`}
                    >
                        <HiTable className="size-5" />
                        Table
                    </Button>
                </div>
                <div className='flex gap-4'>
                    <Button
                        disabled={isLoading}
                        onClick={() => setCreateOpen(true)}
                        color="gray"
                        className=" "
                    >
                        <HiDocumentAdd className="size-5" />
                        New task
                    </Button>

                    <Button
                        disabled={isLoading}
                        onClick={() => setFiltersOpen(true)}
                        color="gray"
                        className="  "
                    >
                        <HiFilter className="size-5" />
                        Filters
                    </Button>
                </div>
            </div>


            <div>
                {isLoading ? (
                    <Loading />
                ) : (
                    <>
                        {activeView === 'Board' && (
                            <BoardViewTasks tasks={tasksData?.data ?? []} />
                        )}
                        {activeView === 'Table' && (
                            <ListViewTasks tasks={tasksData?.data ?? []} />
                        )}
                    </>
                )}
            </div>

            {/* Filters Modal */}
            <ModalFilters filtersOpen={filtersOpen} setFiltersOpen={setFiltersOpen} />
            <ModalCreateTask createOpen={createOpen} setCreateOpen={setCreateOpen} />
        </div>
    );
}

