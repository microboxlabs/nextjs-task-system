import React from 'react';
import { Label, Select, TextInput } from "flowbite-react";
import { useTask } from '@/hooks/useTask';

interface TaskFiltersProps {
    filters: { [key: string]: string };
    onFilterChange: (newFilters: { [key: string]: string }) => void;
    onSort: any
}

export default function TaskFilters({ filters, onFilterChange, onSort }: TaskFiltersProps) {
    //const { handleSortChange } = useTask()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        onFilterChange({ ...filters, [name]: value });
    };

    return (
        <div className="w-full flex flex-wrap sm:flex-nowrap sm:flex-row items-center justify-between gap-2.5 max-w-6xl px-0">
            <Select name="status" value={filters.status || ''} onChange={handleChange} className="w-[48%] sm:w-full" >
                <option value="">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
                <option value="In Progress">In Progress</option>
            </Select>

            <Select name="priority" value={filters.priority || ''} onChange={handleChange} className="w-[48%] sm:w-full">
                <option value="">All Priorities</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
            </Select>

            <TextInput type="text" name="assignedTo" value={filters.assignedTo || ''} onChange={handleChange} placeholder="Assigned To User/Group" className="w-full" />

            <div className="w-full">
                <Label htmlFor="sort" value="Sort By" className='hidden' />
                <Select id='sort' name="sort" value={filters.sort || ''} onChange={onSort} className="w-full">
                    <option value="">Select Sort Option</option>
                    <option value="dueDate">Due Date</option>
                    <option value="priority">Priority</option>
                    <option value="creationDate">Creation Date</option>
                </Select>
            </div>
        </div>
    );
}
