import { DarkThemeToggle } from "flowbite-react";
import Dashboard from "./dashboard/page";
import DashboardWrapper from "./DashboardWrapper";

export default function Home() {
  return (
    <DashboardWrapper>
      <main className="flex min-h-screen items-center justify-center gap-2 dark:bg-gray-800">
        <Dashboard />
        {/*       <h1 className="text-2xl dark:text-white">Flowbite React + Next.js</h1>
      <DarkThemeToggle /> */}
      </main>
    </DashboardWrapper>
  );
}
