// Contexto TaskContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";
import { Task } from "@/types/tasks-types";

interface TaskContextType {
    updateModal: { task: Task };
    setUpdateModal: React.Dispatch<React.SetStateAction<{ task: Task }>>;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    showModal: boolean;
    showDeleteModal: boolean
    setShowDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
    setIdForDelete: React.Dispatch<React.SetStateAction<number>>;
    idForDelete: number
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider = ({ children }: { children: ReactNode }) => {
    const [idForDelete, setIdForDelete] = useState<number>(0)
    const [updateModal, setUpdateModal] = useState<{ task: Task }>({
        task: {
            id: 0,
            title: "",
            description: "",
            user: null,
            group: null,
            dueDate: new Date(),
            priority: { id: 0, name: "" },
            status: { id: 0, name: "" },
        },
    });
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [showModal, setShowModal] = useState<boolean>(false);

    return (
        <TaskContext.Provider value={{
            updateModal, setUpdateModal, setShowModal, showModal, showDeleteModal, setShowDeleteModal, setIdForDelete,
            idForDelete
        }}>
            {children}
        </TaskContext.Provider>
    );
};

export const useTaskContext = () => {
    const context = useContext(TaskContext);
    if (!context) {
        throw new Error("useTaskContext must be used within a TaskProvider");
    }
    return context;
};
