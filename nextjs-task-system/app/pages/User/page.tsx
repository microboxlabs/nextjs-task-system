"use client";

import React, { useEffect, useState } from "react";
import { TableComponent } from "@/app/components/Table";
import { UserModal } from "@/app/components/UserModal";
import ToastNotification from "@/app/components/ToastNotification";
import { getUsers, deleteUser } from "../../../services/userService";
import { getGroup } from "@/services/groupService";
import { Button } from "flowbite-react";
import Swal from 'sweetalert2'
import { useAuthRedirect } from "../../utils/useAuthRedirect";

interface Group {
    id: number;
    name: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    role: string;
    groupId: number;
    group?: Group;
}

export default function UserPage() {

    useAuthRedirect();

    const [users, setUsers] = useState<User[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({});
    const [showToast, setShowToast] = useState(false);
    const [toastProps, setToastProps] = useState({
        message: "",
        type: "success" as "success" | "error",
    });

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const users = await getUsers();
                const usersWithGroup = await Promise.all(
                    users.map(async (user: User) => {
                        const group = user.groupId ? await getGroup(user.groupId) : '';
                        return {
                            ...user,
                            group: group ? group.name : 'Unknown Group'
                        }
                    })
                );
                setUsers(usersWithGroup);
            } catch (error) {
                console.error("Error fetching users: ", error);
            }

        };
        fetchUsers();
    }, []);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleEdit = (user: any) => {
        const { group, ...userData } = user;
        setFormData(userData);
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
                await deleteUser(id);
                setToastProps({ message: "User deleted successfully", type: "success" });
                setShowToast(true);
                setTimeout(() => {
                    setShowToast(false);
                }, 3000);
                window.location.reload();
            } catch (error) {
                setToastProps({ message: "Error deleting user", type: "error" });
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
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Users</h1>
                <Button color="success" className="mt-4" onClick={handleOpenModal}>Add User</Button>
            </div>
            <TableComponent
                data={users}
                excludeColumns={['id', 'password', 'groupId']}
                pageSize={5}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <UserModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                formData={formData}
                setFormData={setFormData}
            />

            {showToast && <ToastNotification message={toastProps.message} type={toastProps.type} />}
        </div >
    );
}