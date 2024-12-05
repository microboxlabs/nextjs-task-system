'use client';
import { useState } from "react";
import { Sidebar } from "flowbite-react";
import {
  HiArrowSmRight,
  HiChartPie,
  HiClipboardCheck,
  HiChevronDoubleLeft,
  HiChevronDoubleRight,
} from "react-icons/hi";
import { logoutAction } from "@/actions/authentication/logout-actions";

export function NavbarPage({ children }: Readonly<{ children: React.ReactNode }>) {
  const [isCollapsed, setCollapsed] = useState(false);

  return (
    <div className="grid min-h-screen" style={{ gridTemplateColumns: isCollapsed ? "80px 1fr" : "250px 1fr" }}>

      <div
        className={`bg-gray-800 text-white min-h-screen transition-all duration-300`}
      >
        <Sidebar aria-label="Sidebar with collapsible functionality">

          <button
            onClick={() => setCollapsed(!isCollapsed)}
            className="p-2 m-2 bg-gray-700 rounded hover:bg-gray-600 flex items-center justify-center"
          >
            {isCollapsed ? <HiChevronDoubleRight /> : <HiChevronDoubleLeft />}
          </button>

          <Sidebar.Items>
            <Sidebar.ItemGroup>
              <Sidebar.Item
                href="/tasks"
                icon={HiClipboardCheck}
                className="flex items-center gap-2"
              >
                {!isCollapsed && "Tasks"}
              </Sidebar.Item>
              <Sidebar.Item
                href="/dashboard"
                icon={HiChartPie}
                className="flex items-center gap-2"
              >
                {!isCollapsed && "Dashboard"}
              </Sidebar.Item>
       
              <form action={logoutAction}>
                <button type="submit" className="group flex w-full items-center rounded-lg  text-left text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 ">
                  <Sidebar.Item href="#" icon={HiArrowSmRight} className="flex items-center gap-2">
                  {!isCollapsed && "Sign Out"}
                  </Sidebar.Item>
                </button>
              </form>

            </Sidebar.ItemGroup>
          </Sidebar.Items>
        </Sidebar>
      </div>


      <main className="p-4 bg-gray-100">
        {children}
      </main>
    </div>
  );
}
