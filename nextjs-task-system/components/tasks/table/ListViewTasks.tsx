import { Task } from "@/types/tasks-types";
import { Table } from "flowbite-react";

interface Props {
    tasks: Task[];
}

export default function ListViewTasks({ tasks }: Props) {
    return (
        <>
            <div className="overflow-x-auto">
                <h2>Tasks by User</h2>
                <Table>
                    <colgroup>
                        <col style={{ width: "20%" }} />
                        <col style={{ width: "20%" }} />
                        <col style={{ width: "20%" }} />
                        <col style={{ width: "20%" }} />
                        <col style={{ width: "20%" }} />
                    </colgroup>
                    <Table.Head>
                        <Table.HeadCell>Task</Table.HeadCell>
                        <Table.HeadCell>User</Table.HeadCell>
                        <Table.HeadCell>Due Date</Table.HeadCell>
                        <Table.HeadCell>Status</Table.HeadCell>
                        <Table.HeadCell>Priority</Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y">
                        {tasks
                            .filter((task) => task.group == null)
                            .map((task, index) => (
                                <Table.Row
                                    key={`person-${index}`}
                                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                                >
                                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                        {task.title}
                                    </Table.Cell>
                                    <Table.Cell>{task.user}</Table.Cell>
                                    <Table.Cell>{task.dueDate.toLocaleString()}</Table.Cell>
                                    <Table.Cell>{task.status}</Table.Cell>
                                    <Table.Cell>{task.priority}</Table.Cell>
                                </Table.Row>
                            ))}
                    </Table.Body>
                </Table>
            </div>

            <div className="overflow-x-auto">
                <h2>Tasks by Group</h2>
                <Table>
                    <colgroup>
                        <col style={{ width: "20%" }} />
                        <col style={{ width: "20%" }} />
                        <col style={{ width: "20%" }} />
                        <col style={{ width: "20%" }} />
                        <col style={{ width: "20%" }} />
                    </colgroup>
                    <Table.Head>
                        <Table.HeadCell>Task</Table.HeadCell>
                        <Table.HeadCell>Group</Table.HeadCell>
                        <Table.HeadCell>Due Date</Table.HeadCell>
                        <Table.HeadCell>Status</Table.HeadCell>
                        <Table.HeadCell>Priority</Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y">
                        {tasks
                            .filter((task) => task.group != null)
                            .map((task, index) => (
                                <Table.Row
                                    key={`group-${index}`}
                                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                                >
                                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                        {task.title}
                                    </Table.Cell>
                                    <Table.Cell>{task.group}</Table.Cell>
                                    <Table.Cell>{task.dueDate.toLocaleString()}</Table.Cell>
                                    <Table.Cell>{task.status}</Table.Cell>
                                    <Table.Cell>{task.priority}</Table.Cell>
                                </Table.Row>
                            ))}
                    </Table.Body>
                </Table>
            </div>
        </>
    );
}
