"use client";

import { useState } from "react";

const SideBarMenu = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div
            className={`${isCollapsed ? "w-16" : "w-64"
                } flex h-screen flex-col bg-gray-800 text-white transition-all duration-300`}
        >
            {/* Botón para expandir/colapsar */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-4 text-left transition-colors hover:bg-gray-700"
            >
                {isCollapsed ? ">" : "< Collapse"}
            </button>

            {/* Lista de elementos */}
            <nav className="mt-4 flex flex-col">
                <SidebarItem text="Dashboard" isCollapsed={isCollapsed} />
                <SidebarItem text="Tasks" isCollapsed={isCollapsed} />
                <SidebarItem text="Users" isCollapsed={isCollapsed} />
            </nav>
        </div>
    )
}

const SidebarItem = ({
    text,
    isCollapsed,
}: {
    text: string;
    isCollapsed: boolean;
}) => {
    return (
        <div
            className="cursor-pointer p-4 text-left transition-colors hover:bg-gray-700"
        >
            {!isCollapsed && <span>{text}</span>}
        </div>
    );
};

export default SideBarMenu