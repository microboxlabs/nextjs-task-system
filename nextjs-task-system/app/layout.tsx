// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeModeScript } from "flowbite-react";
import { Navbar, Toast } from "@/components";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Task Manager",
  description: "This app is a task management tool",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <ThemeModeScript />
      </head>
      <body
        className={`${inter.className} w-full min-w-0 flex-auto bg-white text-gray-600 dark:bg-gray-900 dark:text-gray-400`}
      >
        <div className="flex h-screen flex-col">
          <Navbar />
          <main className="mx-auto flex w-full max-w-screen-xl flex-1 flex-col p-2 md:p-4">
            {children}
            <Toast />
          </main>
        </div>
      </body>
    </html>
  );
}
