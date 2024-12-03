"use client";
import { DarkThemeToggle } from "flowbite-react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const gotologin = () => {
    router.push("/login");
  };
  return (
    <main className="flex min-h-screen items-center justify-center gap-2 dark:bg-gray-800">
      <h1 className="text-2xl dark:text-white">Flowbite React + Next.js</h1>
      <DarkThemeToggle />
      <div>
        <button onClick={gotologin}>Login</button>
      </div>
    </main>
  );
}
