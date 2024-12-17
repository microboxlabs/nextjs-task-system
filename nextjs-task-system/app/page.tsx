import { Button, DarkThemeToggle } from "flowbite-react";

export default function Home() {
  return (
    <main className="grid  mt-5 items-center justify-center dark:b
    g-gray-800">
      <h1 className="text-xl dark:text-white mb-2">Task Management System</h1>
      <Button type="button" href="/login" >
       Login
      </Button>
    </main>
  );
}
