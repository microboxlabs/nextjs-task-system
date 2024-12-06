"use client";
import { useEffect, useState } from "react";
import { Sidebar } from "flowbite-react";
import {
  HiArrowSmRight,
  HiClipboardCheck,
  HiChevronDoubleLeft,
  HiChevronDoubleRight,
} from "react-icons/hi";
import { logoutAction } from "@/actions/authentication/logout-actions";

export function SidebarComponent({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [isCollapsed, setCollapsed] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCollapsed(window.innerWidth < 720);
    }
  }, []);
  const [message, setMessage] = useState<string | null>(null);

  return (
    <div
      className="grid min-h-screen grid-cols-[200px_1fr]"
      style={{
        gridTemplateColumns: isCollapsed ? "50px 1fr" : "200px 1fr",
      }}
    >
      {/* Sidebar */}
      <div className="min-h-screen bg-gray-800 text-white transition-all duration-300">
        <button
          onClick={() => setCollapsed(!isCollapsed)}
          className="m-2 flex items-center justify-center rounded bg-gray-700 p-2 hover:bg-gray-600"
        >
          {isCollapsed ? <HiChevronDoubleRight /> : <HiChevronDoubleLeft />}
        </button>

        {/* Sidebar Content */}
        {!isCollapsed && (
          <Sidebar aria-label="Sidebar with collapsible functionality">
            <Sidebar.Items>
              <Sidebar.ItemGroup>
                <Sidebar.Item
                  href="/tasks"
                  icon={HiClipboardCheck}
                  className="flex items-center gap-2"
                >
                  Tasks
                </Sidebar.Item>
                <form action={logoutAction}>
                  <button
                    type="submit"
                    className="group flex w-full items-center rounded-lg text-left text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                  >
                    <Sidebar.Item
                      href="#"
                      icon={HiArrowSmRight}
                      className="flex items-center gap-2"
                    >
                      Sign Out
                    </Sidebar.Item>
                  </button>
                </form>
                <Sidebar.Item
                  href="#"
                  icon={HiArrowSmRight}
                  className="flex items-center gap-2"
                >
                  {message}
                </Sidebar.Item>
              </Sidebar.ItemGroup>
            </Sidebar.Items>
          </Sidebar>
        )}
      </div>

      {/* Main Content */}
      <main className="overflow-auto bg-gray-100 p-4">{children}</main>
    </div>
  );
}
