"use client";
import NavbarTasks from "@/components/tasks/navbarTasks";
import { TaskProvider } from "@/context/TaskContext";

export default function Home() {
  return (
    <>
      <TaskProvider>
        <NavbarTasks />
      </TaskProvider>
    </>
  );
}
