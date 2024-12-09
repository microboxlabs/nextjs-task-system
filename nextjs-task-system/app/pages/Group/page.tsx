"use client"

import React, { useEffect, useState } from "react";
import { TableComponent } from "@/app/components/Table";
import { GroupModal } from "@/app/components/GroupModal";
import ToastNotification from "@/app/components/ToastNotification";
import { getGroup, deleteGroup, getGroups } from "../../../services/groupService";
import { Button } from "flowbite-react";
import Swal from 'sweetalert2'
import { useAuthRedirect } from "../../utils/useAuthRedirect";

export default function TaskPage() {

    useAuthRedirect();

    const [groups, setGroups] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({});
    const [showToast, setShowToast] = useState(false);
    const [toastProps, setToastProps] = useState({
        message: "",
        type: "success" as "success" | "error",
    });

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const groups = await getGroups();
                setGroups(groups);
            } catch (error) {
                console.error("Error fetching groups: ", error);
            }

        };
        fetchGroups();
    }, []);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleEdit = (group: any) => {
        setFormData(group);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        })

        if (result.isConfirmed) {
            try {
                await deleteGroup(id);
                setToastProps({ message: "Group deleted successfully", type: "success" });
                setShowToast(true);
                setTimeout(() => {
                    setShowToast(false);
                }, 3000);
                window.location.reload();
            } catch (error) {
                setToastProps({ message: "Error deleting group", type: "error" });
                setShowToast(true);
                setTimeout(() => {
                    setShowToast(false);
                }, 3000);

            }
        }
    }

    return (
        <div className="container mx-auto">
            <div className="my-4 flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Groups</h1>
                <Button color="success" onClick={handleOpenModal}>Add Group</Button>
            </div>
            <TableComponent
                data={groups}
                excludeColumns={['id']}
                pageSize={5}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
            <GroupModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                formData={formData}
                setFormData={setFormData}
            />

            {showToast && <ToastNotification message={toastProps.message} type={toastProps.type} />}

        </div>
    );
}

