'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Label, TextInput, Textarea, Select } from 'flowbite-react'

type Priority = 'LOW' | 'MEDIUM' | 'HIGH';
type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'FINISHED';

type Group = {
  id: string
  name: string
}

type User = {
  id: string
  name: string
  group_id: string
}

export const CreateTaskForm = () => {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState<TaskStatus>('PENDING')
  const [assignedTo, setAssignedTo] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [priority, setPriority] = useState<Priority>('MEDIUM')
  const [groupId, setGroupId] = useState<string | ''>('')
  const [users, setUsers] = useState<User[]>([])
  const [groups, setGroups] = useState<Group[]>([])

  const fetchGroups = async () => {
    const res = await fetch('/api/v1/groups');
    const data = await res.json();
    setGroups(data);
  };

  const userFromGroup = async(groupId: string) => {
    const res = await fetch(`/api/v1/groupmember/${groupId}`);
    const data = await res.json();
    const filteredUser = data.filter((user: any) => user.user.role === 'USER');
    const usersArray = filteredUser.map((user: any) => ({
      id: user.user.id,
      name: user.user.name,
      group_id: user.groupId
    }));
    setUsers(usersArray);
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  useEffect(() => {
    if(groupId !== ''){
       userFromGroup(groupId);
    }
  }, [groupId])

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/v1/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: title,
        description: description,
        status: status,
        assigned_to: assignedTo,
        due_date: new Date(dueDate),
        priority: priority,
        group_id: groupId
      })
    });
    if(!res.ok){
      console.error('Failed to create task');
      return;
    }
    router.push('/dashboard')
  }

  return (
    <div className="w-[90%] mx-auto px-4 py-8">
      <h1 className="mb-6 text-center text-2xl font-bold ">Create New Task</h1>
      <form onSubmit={()=>handleSubmit} className="max-w-lg mx-auto space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <TextInput
            id="title"
            type="text"
            placeholder="Enter task title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Enter task description"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <Select id="status" required value={status} onChange={(e) => setStatus(e.target.value as TaskStatus)}>
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="FINISHED">Finished</option>
          </Select>
        </div>
        <div>
          <Label htmlFor="group">Group</Label>
          <Select 
            id="group" 
            required 
            value={groupId} 
            onChange={(e) => setGroupId(e.target.value)}
          >
            <option value="">Select a group</option>
            {groups.map(group => (
              <option key={group.id} value={group.id}>{group.name}</option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="assignedTo">Assigned To</Label>
          <Select
            id="assignedTo"
            required
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            disabled={!groupId}
          >
            <option value="">Select a user</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>{user.name}</option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="dueDate">Due Date</Label>
          <TextInput
            id="dueDate"
            type="date"
            required
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="priority">Priority</Label>
          <Select id="priority" required value={priority} onChange={(e) => setPriority(e.target.value as Priority)}>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </Select>
        </div>
        <div className="flex justify-end space-x-2">
          <Button color="gray" onClick={() => router.push('/dashboard')}>
            Cancel
          </Button>
          <Button type="submit">
            Create Task
          </Button>
        </div>
      </form>
    </div>
  )
}

