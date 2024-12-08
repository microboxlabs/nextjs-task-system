import { DarkThemeToggle } from "flowbite-react";
import { LoginForm } from "./components/LoginForm";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center gap-2 dark:bg-gray-800">
      <DarkThemeToggle />
      <LoginForm />
    </main>
  );
}
