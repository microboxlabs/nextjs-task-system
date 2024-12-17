import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeModeScript } from "flowbite-react";
import "./globals.css";
import { AuthProvider } from "./providers/authProvider";
import { TaskProvider } from "./providers/taskProvider";
import { UserProvider } from "./providers/userProvider";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Task Management System",
  description: "",
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
      <body className={inter.className}>

        <AuthProvider>
          <TaskProvider>
            <UserProvider>
              {children}
            </UserProvider>
          </TaskProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
