"use client";

import Link from "next/link";
import { useState } from "react";

const SideBarMenu = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div
            className={`${isCollapsed ? "w-16" : "w-64"
                } flex h-screen flex-col bg-gray-800 text-white transition-all duration-300`}
        >
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-4 text-left transition-colors hover:bg-gray-700"
            >
                {isCollapsed ? "=" : "X"}
            </button>

            <nav className="mt-4 flex flex-col">
                <SidebarItem text="List View" href="/" isCollapsed={isCollapsed} />
                <SidebarItem text="Board View" href="/board" isCollapsed={isCollapsed} />
            </nav>
        </div>
    )
}

const SidebarItem = ({
    text,
    isCollapsed,
    href,
}: {
    text: string;
    isCollapsed: boolean;
    href: string;
}) => {
    return (
        <Link
            href={href}
            className="cursor-pointer p-4 text-left transition-colors hover:bg-gray-700"
        >
            {!isCollapsed && <span>{text}</span>}
        </Link>
    );
};

export default SideBarMenu