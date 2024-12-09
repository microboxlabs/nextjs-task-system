"use client"
import { useTasks } from "@/context/TasksContext";
import { Table } from "flowbite-react";
import { DropDown } from "../dropDown/DropDown";

export function TableComponent() {
    const { filteredTasks, isAdmin, setFilteredTasks } = useTasks();

    const updateStatus = async (taskId: number, updatedStatus: string) => {
        try {
            const response = await fetch(`/api/tasks/${taskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: updatedStatus }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to update task: ${errorText}`);
            }

            // Parse the response JSON to get the updated task
            const updatedTask = await response.json(); 

            // Update the tasks in state by mapping over the existing tasks and updating the specific task's status
            setFilteredTasks((prevTasks) =>
                prevTasks.map((task) =>
                    task.id === updatedTask.id ? { ...task, status: updatedTask.status } : task
                )
            );
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };
    return (
        <div className="overflow-x-auto p-6">
            <Table hoverable>
                <Table.Head className="text-center">
                    {isAdmin && <Table.HeadCell>Assigned User</Table.HeadCell>}
                    <Table.HeadCell>Tasks</Table.HeadCell>
                    <Table.HeadCell>Description</Table.HeadCell>
                    <Table.HeadCell>Priority</Table.HeadCell>
                    <Table.HeadCell>Due Date</Table.HeadCell>
                    <Table.HeadCell>Status</Table.HeadCell>
                    {/* <Table.HeadCell>Comment</Table.HeadCell> */}
                    {/* Admin-only edit option */}
                    {isAdmin && <Table.HeadCell>Edit</Table.HeadCell>}
                </Table.Head>
                <Table.Body className="divide-y">
                    {filteredTasks.length === 0 ? (
                        <Table.Cell colSpan={isAdmin ? 8 : 7} className="text-center">
                            No hay tareas disponibles.
                        </Table.Cell>
                    ) : (
                        filteredTasks.map((task) => (
                            <Table.Row
                                key={task.id}
                                className="bg-white dark:border-gray-700 dark:bg-gray-800"
                            >
                                {isAdmin && (
                                    <Table.Cell>
                                        {/* Mostrar el nombre del usuario asignado */}
                                        {task.assignedTo?.name || "Unassigned"}
                                    </Table.Cell>
                                )}
                                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                    {task.title}
                                </Table.Cell>
                                <Table.Cell>{task.description}</Table.Cell>
                                <Table.Cell>{task.priority}</Table.Cell>
                                <Table.Cell>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}</Table.Cell>

                                {/* Selector de Estado */}
                                <Table.Cell>
                                    <select
                                        value={task.status}
                                        onChange={(e) => updateStatus(task.id, e.target.value)}
                                        className="text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 p-2 rounded-md"
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Completed">Completed</option>
                                    </select>
                                </Table.Cell>

                                {/* <Table.Cell>
                                    <a
                                        href={`/tasks/comments/${task.id}`}
                                        className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
                                    >
                                        Comments
                                    </a>
                                </Table.Cell> */}

                                {isAdmin && (
                                    <Table.Cell >
                                        <DropDown task={task} />
                                    </Table.Cell>
                                )}
                            </Table.Row>
                        ))
                    )}
                </Table.Body>
            </Table>
        </div>
    );
}
