'use client'

import { useEffect, useState } from 'react';
import { Card, Button, Select, TextInput, Label } from 'flowbite-react';
import { TaskModal } from './TaskModal';
import { Task, User, Priority } from '../types';

const priority = ['LOW', 'MEDIUM', 'HIGH']

export function DashBoard() {
    const [user, setUser] = useState<User | null>(null);
    const [group, setGroup] = useState('');
    const [tasks, setTasks] = useState<Task[]>([]);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [users, setUsers] = useState<User[]>([]);
    const [userId, setUserId] = useState('');
    const [groups, setGroups] = useState([]);
    const [groupId, setGroupId] = useState('');
    const [priority, setPriority] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [createDate, setCreateDate] = useState('');

    const columns = ['PENDING', 'IN_PROGRESS', 'COMPLETED']

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch("/api/v1/me");
                const data = await response.json();
                setUser(data);
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        };
        fetchUser();
        fetchUsers();
        fetchGroups();

    }, []);

    useEffect(() => {
        if (user?.role === 'USER') {
            fetchGroup()
        } else {
            fetchTasks()
        }
    }, [user, showModal])

    useEffect(() => {
        if (group) {
            fetchTaskByGroupId(group)
        }
    }, [group])


    const fetchGroup = async () => {
        const res = await fetch(`/api/v1/users/${user?.id}`)
        const data = await res.json()
        setGroup(data.groups[0].groupId);
    }

    const fetchTasks = async () => {
        const res = await fetch('/api/v1/tasks')
        const data = await res.json()
        setTasks(data)
    }

    const fetchTaskByGroupId = async (groupId: string) => {
        const res = await fetch(`/api/v1/groups/${groupId}`)
        const data = await res.json()
        setTasks(data.tasks)
    }

    const fetchUsers = async () => {
        const res = await fetch('/api/v1/users')
        const data = await res.json()
        console.log(data.filter((user: any) => user.role === 'USER'));
        setUsers(data.filter((user: any) => user.role === 'USER'));
    }

    const fetchGroups = async () => {
        const res = await fetch('/api/v1/groups')
        const data = await res.json()
        console.log(data);
        setGroups(data);
    }

    const openModal = (task: Task) => {
        setSelectedTask(task)
        setShowModal(true)
    }

    const closeModal = () => {
        setShowModal(false)
        setSelectedTask(null)
    }

    const handleFilters = async () => {
        console.log('filters', userId, groupId, priority, dueDate, createDate);
        const res = await fetch(`/api/v1/tasks?assigned_to=${userId}&group_id=${groupId}&priority=${priority}&due_date=${dueDate}&create_date=${createDate}`)
        const data = await res.json()
        setTasks(data);
    }

    return (
        <div className='flex flex-col'>
            <div className='flex flex-row w-[90%] mx-auto gap-5 items-end'>
                <Select id='users' onChange={(e) => setUserId(e.target.value)} className='w-90'>
                    <option value="">Select an user</option>
                    {users.map((users) => (
                        <option key={users.id} value={users.id}>{users.name}</option>
                    ))}
                </Select>
                <Select id='groups' onChange={(e) => setGroupId(e.target.value)} className='w-90'>
                    <option value="">Select a group</option>
                    {groups.map((group: any) => (
                        <option key={group.id} value={group.id}>{group.name}</option>
                    ))}
                </Select>
                <Select id="priority" required value={priority} onChange={(e) => setPriority(e.target.value as Priority)}>
                    <option value="">Select a priority</option>
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                </Select>
                <div>
                    <Label htmlFor="dueDate">Due Date</Label>
                    <TextInput
                        id="dueDate"
                        type='date'
                        onChange={(e) => setDueDate(e.target.value)}
                    />
                </div>
                <div>
                    <Label htmlFor="createDate">Due Date</Label>
                    <TextInput
                        id="createDate"
                        type='date'
                        onChange={(e) => setCreateDate(e.target.value)}
                    />
                </div>
                <Button onClick={handleFilters}>Filter</Button>
            </div>


            <div className="m-auto mt-6 flex w-[90%] flex-col gap-4 md:flex-row">

                {columns.map((column) => (
                    <div key={column} className="flex-1">
                        <h3 className="mb-2 text-center text-lg font-semibold capitalize">{column.replace('-', ' ')}</h3>
                        <div className="h-full rounded-lg bg-gray-200 p-4">
                            {tasks
                                .filter((task) => task.status === column)
                                .map((task) => (
                                    <Card key={task.id} className="mb-3">
                                        <h5 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
                                            {task.title}
                                        </h5>
                                        <Button onClick={() => openModal(task)}>Ver más</Button>
                                    </Card>
                                ))}
                        </div>
                    </div>
                ))}
                <TaskModal task={selectedTask} showModal={showModal} onClose={closeModal} />
            </div>
        </div>
    )
}

