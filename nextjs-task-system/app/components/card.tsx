"use client";

import { Badge, Card, Dropdown, Select } from "flowbite-react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { useContext, useEffect, useState } from "react";
import { PaginationTask } from "./pagination";
import { getStatusColor, ModalView } from "./modalView";
import { AuthContexts } from "../contexts/authContexts";
import { TaskContexts } from "../contexts/taskContexts";
import { usePaginate } from "../hooks/usePaginate";
import { ModalDelete } from "./modalDelete";
import { ModalForm } from "./modal";
import { UserContexts } from "../contexts/userContexts";



export function CardTasks() {
    const { state: stateUser } = useContext(AuthContexts);
    const { state: stateTask, getTasks,updateTask } = useContext(TaskContexts);
    const { state: stateUsers, getUsers, getGroups } = useContext(UserContexts);

    const limit = 10;
    const { offset, page, onNext, onPrev, setPage } = usePaginate(0, limit, 1);
    const [openModal, setOpenModal] = useState(false);
    const [openModalDelete, setOpenModalDelete] = useState(false);
    const [openModalEdit, setOpenModalEdit] = useState(false);
    const [selectedTask, setSelectedTask] = useState({});
    const [deletedTask, setDeletedTask] = useState({});
    const [editTask, setEditTask] = useState({});
    const [sort, setSort] = useState({ field: "", order: "" });


    useEffect(() => {
        getTasks();
        getUsers();
        getGroups();
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



    const sortTasks = (tasks: any[]) => {
        if (!sort.field || !sort.order) return tasks;

        const sorted = [...tasks].sort((a, b) => {
            let valA = a[sort.field];
            let valB = b[sort.field];

            if (sort.field === "priority") {
                if (sort.field === "priority") {
                    const priorityMap: { low: number; medium: number; high: number } = { low: 1, medium: 2, high: 3 };

                    valA = priorityMap[valA as keyof typeof priorityMap] || 0;
                    valB = priorityMap[valB as keyof typeof priorityMap] || 0;
                }
            }

            if (sort.order === "asc") {
                return valA > valB ? 1 : valA < valB ? -1 : 0;
            } else {
                return valA < valB ? 1 : valA > valB ? -1 : 0;
            }
        });

        return sorted;
    };

    const sortedTasks = sortTasks(stateTask?.tasks || []);
    const paginatedTasks = sortedTasks.slice(offset, offset + limit);

    const handleAssignTask = (taskId: string, assignedTo: string) => {
        // assigneTask(taskId, assignedTo);
        // setAssignedTo(assignedTo); 
    };

    const handleUpdateStatus = async (data: any) => {
        try {
            await updateTask(data);
            getTasks();

        } catch (error) {
            console.error("Error updating task:", error);
        } 
        
    };

    if (stateTask.isLoading && paginatedTasks.length === 0) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            {stateUser.user.rol === "admin" && (
                <div className="mb-4 mt-3 w-64">
                    <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white mb-2">Order by:</h5>

                    <Select
                        id="sort"
                        name="sort"
                        onChange={(e) => {
                            const [field, order] = e.target.value.split("-");
                            setSort({ field, order });
                        }}
                    >
                        <option value="">Select sorting</option>
                        <option value="due_date-asc">Due Date: Ascending</option>
                        <option value="due_date-desc">Due Date: Descending</option>
                        <option value="priority-asc">Priority: Low to High</option>
                        <option value="priority-desc">Priority: High to Low</option>
                        <option value="id-asc">Creation: Ascending</option>
                        <option value="id-desc">Creation: Descending</option>
                    </Select>
                </div>

            )}
            <Card className="w-100 mt-2 h-auto">
                <div className="mb-4 flex items-center justify-between">
                    <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">Task List</h5>
                </div>
                {paginatedTasks.length > 0 ? (
                    <div>
                        <div className="flow-root">
                            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                                {sortedTasks.map((task: any, index: number) => (
                                    <li key={index} className="py-3 sm:py-4">
                                        <div className="flex items-center">
                                            <div className="min-w-0 flex cursor-pointer w-full" onClick={() => handleSelectedTask(task)}>
                                                <div className="min-w-0 flex-1">
                                                    <p className="truncate text-sm font-medium text-gray-900 dark:text-white">{task.title}</p>
                                                    <p className="truncate text-sm text-gray-500 dark:text-gray-400">{task.description}</p>
                                                    <p className="truncate text-sm text-gray-500 dark:text-gray-400">{task.date}</p>
                                                </div>
                                                <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                                                    <Badge size="sm" color={getStatusColor(task?.status)} className="uppercase">
                                                        {task.status == "in_progress" ? "in progress" : task.status }
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
                                        <div className="flex gap-2 mt-2">
                                            <Dropdown label="Assign Task" size="sm">
                                                {stateUsers.users && stateUsers.users.length > 0 &&
                                                    (
                                                        stateUsers.users.map((user: any) => (
                                                            <Dropdown.Item
                                                                key={user.id}
                                                                onClick={() => handleAssignTask(task.id, user.id)}
                                                            >
                                                                {user.username}
                                                            </Dropdown.Item>
                                                        ))
                                                    )
                                                }
                                                <Dropdown.Divider />
                                                {stateUsers.groups && stateUsers.groups.length > 0 &&
                                                    (
                                                        stateUsers.groups.map((group: any) => (
                                                            <Dropdown.Item
                                                                key={group.id}
                                                                onClick={() => handleAssignTask(task.id, group.id)}
                                                            >
                                                                {group.name}
                                                            </Dropdown.Item>
                                                        ))
                                                    )
                                                }
                                            </Dropdown>
                                            <Dropdown label="Update Status" size="sm">
                                            {task.status !== "pending" && <Dropdown.Item  onClick={() => handleUpdateStatus({...task, statusNew: "pending"})} >Pending </Dropdown.Item>}
                                            {task.status !== "in_progress" && <Dropdown.Item  onClick={() => handleUpdateStatus({...task, statusNew: "in_progress"})}>In Progress</Dropdown.Item>}
                                            {task.status !== "complete" && <Dropdown.Item  onClick={() => handleUpdateStatus({...task, statusNew :"complete"})}>Complete </Dropdown.Item>}
                                            </Dropdown>
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
        </div>

    );
}
