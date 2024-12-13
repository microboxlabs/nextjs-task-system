"use client";

import { Button, Sidebar } from "flowbite-react";
import { HiArrowSmRight, HiChartPie, HiUser, HiUsers } from "react-icons/hi";
import { useState } from "react";

export function Dashboard() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex">
            <Button
                className="md:hidden fixed top-2 left-3 z-50 "
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
                 Filters
            </Button>

            <Sidebar
                aria-label="Sidebar with content separator example"
                className={`h-screen w-64 md:static fixed z-40 transform ${
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                } transition-transform bg-white md:translate-x-0`}
            >
                <Sidebar.Items>
                    <Sidebar.ItemGroup>
                        <Sidebar.Item href="#" icon={HiChartPie}>
                            Filters by:
                        </Sidebar.Item>

                        <div className="px-4 py-2">
                            <label htmlFor="userFilter" className="text-sm font-medium text-gray-700">
                                Users
                            </label>
                            <select
                                id="userFilter"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 md:text-sm"
                            >
                                <option value="all">All Users</option>
                                <option value="admins">Admins</option>
                                <option value="guests">Guests</option>
                            </select>
                        </div>

                        <div className="px-4 py-2">
                            <label htmlFor="groupFilter" className="text-sm font-medium text-gray-700">
                                Group
                            </label>
                            <select
                                id="groupFilter"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 md:text-sm"
                            >
                                <option value="all">All Groups</option>
                                <option value="group1">Group 1</option>
                                <option value="group2">Group 2</option>
                            </select>
                        </div>

        
                        <div className="px-4 py-2">
                            <label htmlFor="statusFilter" className="text-sm font-medium text-gray-700">
                                Status
                            </label>
                            <select
                                id="statusFilter"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 md:text-sm"
                            >
                                <option value="pending">Pending</option>
                                <option value="in_progress">In Progress</option>
                                <option value="complete">Complete</option>
                                
                            </select>
                        </div>

                        <div className="px-4 py-2">
                            <label htmlFor="statusFilter" className="text-sm font-medium text-gray-700">
                                Priority
                            </label>
                            <select
                                id="statusFilter"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 md:text-sm"
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                    </Sidebar.ItemGroup>

                </Sidebar.Items>
            </Sidebar>

        </div>
    );
}
