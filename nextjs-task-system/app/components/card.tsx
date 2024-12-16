"use client";

import { Badge, Card } from "flowbite-react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { useContext, useEffect, useState } from "react";
import { PaginationTask } from "./pagination";
import { ModalView } from "./modalView";
import { AuthContexts } from "../contexts/authContexts";
import { TaskContexts } from "../contexts/taskContexts";
import { usePaginate } from "../hooks/usePaginate";
import { ModalDelete } from "./modalDelete";
import { ModalForm } from "./modal";


export function CardTasks() {
    const { state: stateUser } = useContext(AuthContexts);
    const { state: stateTask, getTasks } = useContext(TaskContexts);

    const limit = 10;
    const { offset, page, onNext, onPrev, setPage } = usePaginate(0, limit, 1);
    const paginatedTasks = stateTask?.tasks.slice(offset, offset + limit);
    const [openModal, setOpenModal] = useState(false);
    const [openModalDelete, setOpenModalDelete] = useState(false);
    const [openModalEdit, setOpenModalEdit] = useState(false);
    const [selectedTask, setSelectedTask] = useState({});
    const [deletedTask, setDeletedTask] = useState({});
    const [editTask, setEditTask] = useState({});


    useEffect(() => {
        getTasks();
    }, []);

    const handleSelectedTask = (task: any) => {
        setOpenModal(true);
        setSelectedTask(task);
    };

    const handleDeletedTask = (task: any) => {
        setOpenModalDelete(true);
        setDeletedTask(task);
    };

    const handleEditTask = (task: any) => {
        setOpenModalEdit(true);
        setEditTask(task);
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        if (newPage > page) onNext();
        if (newPage < page) onPrev();
    };

    if (stateTask.isLoading && paginatedTasks.length === 0) {
        return <div>Loading...</div>;
    }

    return (
        <Card className="w-100 mt-2 h-auto">
            <div className="mb-4 flex items-center justify-between">
                <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">Task List</h5>
            </div>
            {paginatedTasks.length > 0 ? (
                <div>
                    <div className="flow-root">
                        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                            {paginatedTasks.map((task: any, index: number) => (
                                <li key={index} className="py-3 sm:py-4">
                                    <div className="flex items-center">
                                        <div className="min-w-0 flex cursor-pointer w-full" onClick={() => handleSelectedTask(task)}>
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-medium text-gray-900 dark:text-white">{task.title}</p>
                                                <p className="truncate text-sm text-gray-500 dark:text-gray-400">{task.description}</p>
                                                <p className="truncate text-sm text-gray-500 dark:text-gray-400">{task.date}</p>
                                            </div>
                                            <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                                                <Badge size="sm" color="info" className="uppercase">
                                                    {task.status || "Default"}
                                                </Badge>
                                            </div>
                                        </div>
                                        {stateUser.user.rol === "admin" && (
                                            <div className="inline-grid items-center text-base font-semibold text-gray-900 dark:text-white cursor-pointer ml-3">
                                                <div onClick={() => handleEditTask(task)}>
                                                    <FaEdit size={20} color="427DC0" />
                                                </div>
                                                <br />
                                                <div onClick={() => handleDeletedTask(task)}>
                                                    <FaTrashAlt size={20} color="#C04242" />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <ModalView openModal={openModal} setOpenModal={setOpenModal} task={selectedTask} />
                        <ModalDelete openModal={openModalDelete} setOpenModal={setOpenModalDelete} task={deletedTask} />
                        <ModalForm openModal={openModalEdit} setOpenModal={setOpenModalEdit} task={editTask} />
                    </div>
                    {stateTask?.tasks.length > limit &&
                        <PaginationTask currentPage={page} totalPages={Math.ceil(stateTask?.tasks.length / limit)} onPageChange={handlePageChange} />
                    }

                </div>
            ) : (
                <div className="flex justify-center items-center">There are no tasks available!...</div>
            )}
        </Card>
    );
}
