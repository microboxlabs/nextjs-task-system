"use client"

import { useState } from 'react';

const TaskFilters = ({ onFiltersChange }: { onFiltersChange: (filters: any) => void }) => {
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    dueDate: '',
    assignedTo: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;

     // Update the filter state based on the changed field
    const updatedFilters = { ...filters, [name]: value };

    // Update the local state and notify the parent component about the change
    setFilters(updatedFilters);

    // Notify the parent component about the updated filters
    onFiltersChange(updatedFilters);
  };

  return (
    <div className="p-6">
      <form className="space-y-6">
        <div className="flex gap-4 mb-4">
          <div>
            <label htmlFor="status" className="block text-gray-700">Status</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleChange}
              className="mt-2 rounded-md p-2"
            >
              <option value="">All</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div>
            <label htmlFor="priority" className="block text-gray-700">Priority</label>
            <select
              name="priority"
              value={filters.priority}
              onChange={handleChange}
              className="mt-2 rounded-md p-2"
            >
              <option value="">All</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div>
            <label htmlFor="dueDate" className="block text-gray-700">Due Date</label>
            <input
              type="date"
              name="dueDate"
              value={filters.dueDate}
              onChange={handleChange}
              className="mt-2 rounded-md p-2"
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default TaskFilters;
