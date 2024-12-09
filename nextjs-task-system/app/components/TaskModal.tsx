"use client";

import { Button, Label, Modal, TextInput, Textarea, Select } from "flowbite-react";
import { useState, useEffect } from "react";
import { getUsers } from "../../services/userService";
import { getGroups } from "@/services/groupService";
import { createTask, getTasks, updateTask } from "../../services/taskService";
import ToastNotification from "./ToastNotification";
import { parseISO, format } from "date-fns";

interface Group {
    id: number;
    name: string;
}

interface User {
    id: number;
    name: string;
}

interface UserModalProps {
    isOpen: boolean;
    onClose: () => void;
    formData: any;
    setFormData: (formData: any) => void;
}

export function TaskModal({ isOpen, onClose, formData, setFormData }: UserModalProps) {

    const [groups, setGroups] = useState<Group[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [showToast, setShowToast] = useState(false);
    const [toastProps, setToastProps] = useState({
        message: "",
        type: "success" as "success" | "error",
    });


    useEffect(() => {
        const fetchData = async () => {
            try {
                const users = await getUsers();
                const groups = await getGroups();
                setUsers(users);
                setGroups(groups);
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        };
        fetchData();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        const updatedValue = name === "assignedToId" || name === "groupId" ? parseInt(value) : value;

        setFormData({
            ...formData,
            [name]: updatedValue,
            ...(name === "assignedToId" && { groupId: null }),
            ...(name === "groupId" && { assignedToId: null }),
        });
    };

    const handleSave = async () => {
        try {

            const formattedDueDate = format(parseISO(formData.dueDate), "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
            formData.dueDate = formattedDueDate;

            if (formData.id) {
                await updateTask(formData.id, formData);
            } else {
                await createTask(formData);
            }
            setToastProps({ message: "Task saved successfully", type: "success" });
            setShowToast(true);
            onClose();
            window.location.reload();
        } catch (error) {
            setToastProps({ message: "Error saving task", type: "error" });
            setShowToast(true);
            console.error("Error saving task: ", error);
        }
    };

    return (
        <div>
            <Modal show={isOpen} size="md" onClose={onClose} popup>
                <Modal.Header>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Add or Edit Task</h2>
                </Modal.Header>
                <Modal.Body>
                    <div className="grid grid-cols-1 gap-6">
                        <div>
                            <Label htmlFor="title" value="Title" />
                            <TextInput
                                id="title"
                                name="title"
                                placeholder="Enter title"
                                value={formData.title}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="description" value="Description" />
                            <Textarea
                                id="description"
                                name="description"
                                placeholder="Enter description"
                                value={formData.description}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="priority" value="Priority" />
                            <Select
                                id="priority"
                                name="priority"
                                value={formData.priority || ""}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="" disabled>Select priority</option>
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="status" value="Status" />
                            <Select
                                id="status"
                                name="status"
                                value={formData.status || ""}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="" disabled>Select status</option>
                                <option value="Pending">Pending</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="assignedToId" value="Assigned to User" />
                            <Select
                                id="assignedToId"
                                name="assignedToId"
                                value={formData.assignedToId || ""}
                                onChange={handleInputChange}
                            // disabled={formData.groupId > 0}
                            >
                                <option value="" disabled>Select a user</option>
                                {users.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.name}
                                    </option>
                                ))}
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="groupId" value="Assigned to Group" />
                            <Select
                                id="groupId"
                                name="groupId"
                                value={formData.groupId || ""}
                                onChange={handleInputChange}
                            // disabled={formData.assignedToId > 0}
                            >
                                <option value="" disabled>Select a group</option>
                                {groups.map((group) => (
                                    <option key={group.id} value={group.id}>
                                        {group.name}
                                    </option>
                                ))}
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="dueDate" value="Due Date" />
                            <TextInput
                                id="dueDate"
                                name="dueDate"
                                type="datetime-local"
                                value={formData.dueDate || ""}
                                onChange={handleInputChange}
                                required
                            />
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