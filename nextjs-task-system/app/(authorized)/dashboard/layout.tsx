import React, { PropsWithChildren } from "react";
import Nav from "@/components/dashboard/nav";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

import { UserProvider } from "@/contexts/UserContext";
import { TaskProvider } from "@/contexts/TaskContext";
import { UsersGroupProvider } from "@/contexts/UsersGroupsContext";
export default async function DashboardLayout({ children }: PropsWithChildren) {
  const session = await auth();
  if (!session) return redirect("/");
  return (
    <UserProvider>
      <TaskProvider>
        <UsersGroupProvider>
          <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <Nav />
            <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
              {children}
            </main>
          </div>
        </UsersGroupProvider>
      </TaskProvider>
    </UserProvider>
  );
}
