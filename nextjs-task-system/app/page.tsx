"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 dark:bg-gray-800">
      <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
        Task Management System Solution
      </h1>
      <p className="mb-8 text-lg text-gray-700 dark:text-gray-300">
        by : <span className="font-bold">Braulio Reyes</span>
      </p>
      <Link href="/login">
        <button className="rounded-lg bg-blue-500 px-6 py-3 text-white transition-colors hover:bg-blue-600">
          Go to Login
        </button>
      </Link>
    </main>
  );
}
