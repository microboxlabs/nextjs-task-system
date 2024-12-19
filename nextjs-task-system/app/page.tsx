import { DarkThemeToggle } from "flowbite-react";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center gap-2">
      <h1 className="text-2xl dark:text-white">Flowbite React + Next.js</h1>
      <DarkThemeToggle />
    </div>
  );
}
