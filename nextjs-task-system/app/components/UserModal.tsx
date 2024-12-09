"use client";

import { Button, Label, Modal, TextInput, Select } from "flowbite-react";
import { useState, useEffect } from "react";
import { getGroups } from "../../services/groupService";
import { createUser, updateUser } from "../../services/userService";
import ToastNotification from "./ToastNotification";


interface Group {
    id: number;
    name: string;
}

interface UserModalProps {
    isOpen: boolean;
    onClose: () => void;
    formData: any;
    setFormData: (formData: any) => void;
}

export function UserModal({ isOpen, onClose, formData, setFormData }: UserModalProps) {

    const [groups, setGroups] = useState<Group[]>([]);
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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        const updatedValue = name === "groupId" ? parseInt(value) : value;

        setFormData({ ...formData, [name]: updatedValue });
    };

    const handleSave = async () => {
        try {
            if (formData.id) {
                await updateUser(formData.id, formData);
            } else {
                await createUser(formData);
            }
            setToastProps({ message: "User saved successfully", type: "success" });
            setShowToast(true);
            onClose();
            window.location.reload();
        } catch (error) {
            setToastProps({ message: "Error saving user", type: "error" });
            setShowToast(true);
            console.error("Error saving user: ", error);
        }
    };

    return (
        <div>
            <Modal show={isOpen} size="md" onClose={onClose} popup>
                <Modal.Header>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Add or Edit User</h2>
                </Modal.Header>
                <Modal.Body>
                    <div className="grid grid-cols-1 gap-6">
                        <div>
                            <Label htmlFor="name" value="Name" />
                            <TextInput
                                id="name"
                                name="name"
                                placeholder="Enter name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="email" value="Email" />
                            <TextInput
                                id="email"
                                name="email"
                                placeholder="Enter email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="password" value="Password" />
                            <TextInput
                                id="password"
                                name="password"
                                type="password"
                                placeholder="Enter password"
                                value={formData.password || ""}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="role" value="Role" />
                            <Select
                                id="role"
                                name="role"
                                value={formData.role || ""}
                                onChange={handleInputChange}
                            >
                                <option value="" disabled>
                                    Select a role
                                </option>
                                <option value="Admin">Admin</option>
                                <option value="Regular">Regular</option>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="groupId" value="Group" />
                            <Select
                                id="groupId"
                                name="groupId"
                                value={formData.groupId || ""}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="" disabled>
                                    Select a group
                                </option>
                                {groups.map((group) => (
                                    <option key={group.id} value={group.id}>
                                        {group.name}
                                    </option>
                                ))}
                            </Select>
                        </div>

                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button color="success" onClick={handleSave}>Save</Button>
                    <Button onClick={onClose}>Cancel</Button>
                </Modal.Footer>
                {showToast && <ToastNotification message={toastProps.message} type={toastProps.type} />}
            </Modal>
        </div>
    );
}