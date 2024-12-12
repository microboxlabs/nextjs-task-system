
"use client";

import { Badge, Card } from "flowbite-react";
import Image from "next/image";
import { HiOutlinePlusCircle } from "react-icons/hi";
import { PaginationTask } from "./pagination";
import { FaEdit,FaTrashAlt  } from "react-icons/fa";
import { useState } from "react";
import { ModalView } from "./modalView";

export function CardTasks() {

    const [openModal, setOpenModal] = useState(false);
    return (
        <Card className="w-100 mt-2 h-auto">
            <div className="mb-4 flex items-center justify-between">
                <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">Task List</h5>
            </div>
            <ModalView openModal={openModal} setOpenModal={setOpenModal}/>
            <div className="flow-root">
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    <li className="py-3 sm:py-4" onClick={() => setOpenModal(true)}>
                        <div className="flex items-center space-x-4">

                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium text-gray-900 dark:text-white">Ttitulo tarea</p>
                                <p className="truncate text-sm text-gray-500 dark:text-gray-400">descripcion tarea</p>
                                <p className="truncate text-sm text-gray-500 dark:text-gray-400">fecha</p>
                            </div>
                            <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                                <Badge size="sm" color="info">Default</Badge>
                            </div>
                            <div className="inline-grid items-center text-base font-semibold text-gray-900 dark:text-white cursor-pointer">
                                <FaEdit size={20} color="427DC0"/> <br/>
                                <FaTrashAlt  size={20} color="#C04242"/>
                        
                            </div>
                        </div>
                    </li>
                    <li className="py-3 sm:py-4">
                        <div className="flex items-center space-x-4">

                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium text-gray-900 dark:text-white">Ttitulo tarea</p>
                                <p className="truncate text-sm text-gray-500 dark:text-gray-400">descripcion tarea</p>
                                <p className="truncate text-sm text-gray-500 dark:text-gray-400">fecha</p>
                            </div>
                            <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                                <Badge size="sm" color="info">Default</Badge>
                                
                            </div>
                            <div className="inline-grid items-center text-base font-semibold text-gray-900 dark:text-white cursor-pointer">
                                <FaEdit size={20} color="427DC0"/> <br/>
                                <FaTrashAlt  size={20} color="#C04242"/>
                        
                            </div>
                        </div>
                    </li>
                    <li className="py-3 sm:py-4">
                        <div className="flex items-center space-x-4">

                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium text-gray-900 dark:text-white">Ttitulo tarea</p>
                                <p className="truncate text-sm text-gray-500 dark:text-gray-400">descripcion tarea</p>
                                <p className="truncate text-sm text-gray-500 dark:text-gray-400">fecha</p>
                            </div>
                            <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                                <Badge size="sm" color="info">Default</Badge>
                            </div>
                            <div className="inline-grid items-center text-base font-semibold text-gray-900 dark:text-white cursor-pointer">
                                <FaEdit size={20} color="427DC0"/> <br/>
                                <FaTrashAlt  size={20} color="#C04242"/>
                        
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
            <PaginationTask />
        </Card>
        
    );
}
