'use client'
import { useEffect, useState } from 'react';
import { Button } from 'flowbite-react';
import { HiViewBoards, HiTable, HiFilter, HiDocumentAdd } from 'react-icons/hi';
import ListViewTasks from './table/ListViewTasks';
import BoardViewTasks from './board/boardViewTasks';
import ModalFilters from './modals/modalFilters';
import ModalCreateTask from './modals/modalCreateTask';
import { ResponseTaskGet } from '@/types/tasks-types';
import Loading from '@/components/tasks/loading';
import { DynamicBanner } from '../layout/bannerMessage';
import { TaskProvider } from '@/context/TaskContext';

export default function CustomNavbarWithFilters() {
    const [filtersOpen, setFiltersOpen] = useState<boolean>(false);
    const [activeView, setActiveView] = useState<string>('Board');
    const [createOpen, setCreateOpen] = useState<boolean>(false);
    const [tasksData, setTasksData] = useState<ResponseTaskGet>({
        data: [],
        message: "",
        status: 0
    });
    const [showToast, setShowToast] = useState<{ show: boolean, message: string, icon: 'alert' | 'warning' | 'success' | '' }>({ show: false, message: "", icon: "" });
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
                cache: 'no-store',
                credentials: "include",
            });
    
            const responseData: ResponseTaskGet = await response.json();
            setTasksData({ data: responseData.data, message: responseData.message, status: responseData.status });
            setIsLoading(false); 
        };
    
        if (isLoading) {  
            fetchData();
        }
    
    }, [isLoading]);

    return (
        <div className="p-4 min-h-screen flex flex-col">

            <div className="mb-4 md:flex justify-between items-center bg-gray-100 p-3 rounded shadow-md">
                <div className="flex gap-4 mb-3 md:mb-0">
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
                <div className="flex gap-4">
                    <Button
                        disabled={isLoading}
                        onClick={() => setCreateOpen(true)}
                        color="gray"
                    >
                        <HiDocumentAdd className="size-5" />
                        New task
                    </Button>

                    <Button
                        disabled={isLoading}
                        onClick={() => setFiltersOpen(true)}
                        color="gray"
                    >
                        <HiFilter className="size-5" />
                        Filters
                    </Button>
                </div>
            </div>
            {/*Dynamic banner for the api response*/}
            <DynamicBanner icon={showToast.icon} message={showToast.message} setShowToast={setShowToast} showToast={showToast.show} />
            {/* Contenedor para contenido con scroll */}
            <TaskProvider >
            <div className="flex-1 overflow-auto max-h-screen p-4">
                {isLoading ? (
                    <Loading />
                ) : (
                    <>
                        {activeView === 'Board' && (
                            <BoardViewTasks tasks={tasksData?.data ?? []} setTasksData={setTasksData} setShowToast={setShowToast}/>
                        )}
                        {activeView === 'Table' && (
                            <ListViewTasks tasks={tasksData?.data ?? []} setTasksData={setTasksData} setShowToast={setShowToast}/>
                        )}
                    </>
                )}
            </div>
            </TaskProvider>

            {/* Modales para Funcionalidades */}
            <ModalFilters filtersOpen={filtersOpen} setFiltersOpen={setFiltersOpen} />
            <ModalCreateTask createOpen={createOpen} setCreateOpen={setCreateOpen} setTasksData={setTasksData} setShowToast={setShowToast}/>
        </div>
    );
}
