'use client'

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CreateTaskForm } from "../../components/CreateTaskForm";

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

  useEffect(() => {
    if (!user) {
      return;
    } else {
      if (user?.role !== "ADMIN") {
        router.push("/dashboard");
        return;
      }
    }
  }, [user]);


  return (
    <div className="flex">
        <CreateTaskForm />
    </div>
  );
};

export default Task;