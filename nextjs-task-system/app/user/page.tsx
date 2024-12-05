"use client";
import React, { useEffect, useState } from "react";
import TaskCard from "@/componentes/TaskComponents/TaskCard";

type Task = {
  id: number;
  title: string;
  description: string;
  assigned_to: number;
  due_date: string;
  priority: string;
  status: string;
  comments?: string;
};

const UserDashboard = () => {
  const [recentTasks, setRecentTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // TODO: Replace with actual user ID from authentication
  const currentUserId = 1; // This should come from your auth system

  useEffect(() => {
    const fetchRecentTasks = async () => {
      try {
        const response = await fetch("/api/tasks");
        const allTasks = await response.json();
        // Filter tasks for current user and get only recent ones
        const userTasks = allTasks
          .filter((task: Task) => task.assigned_to === currentUserId)
          .slice(0, 3); // Get only the 3 most recent tasks
        setRecentTasks(userTasks);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentTasks();
  }, [currentUserId]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 mt-12 text-2xl font-bold md:mt-0">Dashboard</h1>

      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">Recent Tasks</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {recentTasks.map((task) => (
            <TaskCard key={task.id} task={task} variant="user" />
          ))}
        </div>
        {recentTasks.length === 0 && (
          <p className="text-center text-gray-500">No recent tasks.</p>
        )}
      </section>
    </div>
  );
};

export default UserDashboard;
