'use client'

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SideNavBar } from "../components/SideNavBar";
import { CreateTaskForm } from "../components/CreateTaskForm";

interface User {
  id: string;
  email: string;
  role: string;
}

const Task = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/v1/me");
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

  if (!user) {
    router.push("/");
    return null;
  }

  if(user?.role !== "ADMIN") {
    router.push("/dashboard");
    return null;
  }


  return (
    <div className="flex">
      <div className="w-1/6">
        <SideNavBar />
      </div>
      <div className="w-5/6">
        <CreateTaskForm />
      </div>
    </div>
  );
};

export default Task;