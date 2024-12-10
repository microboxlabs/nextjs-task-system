"use client";
import React, { useEffect, useState } from "react";
import { Card } from "flowbite-react";
import { useRouter } from "next/navigation";

interface Task {
  id: number;
  title: string;
  description: string;
  assigned_to: number;
  due_date: string;
  priority: string;
  status: string;
  comments?: string;
  user_name?: string;
}

type TaskSummary = {
  total: number;
  byStatus: {
    Pending: number;
    "In Progress": number;
    Completed: number;
  };
  byPriority: {
    Low: number;
    Medium: number;
    High: number;
  };
};

const SkeletonCard = () => (
  <div className="animate-pulse">
    <div className="h-40 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
  </div>
);

const SummarySkeleton = () => (
  <div className="animate-pulse">
    <div className="mb-6">
      <div className="h-32 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
    </div>
    <div className="mb-2 h-6 w-24 rounded bg-gray-200 dark:bg-gray-700"></div>
    <div className="mb-6 grid gap-4 md:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="h-32 rounded-lg bg-gray-200 dark:bg-gray-700"
        ></div>
      ))}
    </div>
    <div className="mb-2 h-6 w-24 rounded bg-gray-200 dark:bg-gray-700"></div>
    <div className="grid gap-4 md:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="h-32 rounded-lg bg-gray-200 dark:bg-gray-700"
        ></div>
      ))}
    </div>
  </div>
);

const TasksSkeleton = () => (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <div key={i} className="animate-pulse">
        <div className="h-48 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
      </div>
    ))}
  </div>
);

const UserDashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskSummary, setTaskSummary] = useState<TaskSummary>({
    total: 0,
    byStatus: {
      Pending: 0,
      "In Progress": 0,
      Completed: 0,
    },
    byPriority: {
      Low: 0,
      Medium: 0,
      High: 0,
    },
  });
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const router = useRouter();

  // Primero obtenemos el ID del usuario actual
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const response = await fetch("/api/auth/me");
        if (!response.ok) {
          throw new Error("No authenticated user");
        }
        const userData = await response.json();
        setCurrentUserId(userData.id);
      } catch (error) {
        console.error("Error fetching current user:", error);
        router.push("/login");
      }
    };

    getCurrentUser();
  }, [router]);

  // Luego obtenemos las tareas cuando tengamos el ID del usuario
  useEffect(() => {
    if (currentUserId) {
      fetchUserTasks();
    }
  }, [currentUserId]);

  const fetchUserTasks = async () => {
    if (!currentUserId) return;

    try {
      const response = await fetch(`/api/tasks/user/${currentUserId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }
      const tasks = await response.json();
      setTasks(tasks);

      // Calculate summary
      const summary: TaskSummary = {
        total: tasks.length,
        byStatus: {
          Pending: 0,
          "In Progress": 0,
          Completed: 0,
        },
        byPriority: {
          Low: 0,
          Medium: 0,
          High: 0,
        },
      };

      tasks.forEach((task: Task) => {
        if (summary.byStatus.hasOwnProperty(task.status)) {
          summary.byStatus[task.status as keyof typeof summary.byStatus]++;
        }

        if (summary.byPriority.hasOwnProperty(task.priority)) {
          summary.byPriority[
            task.priority as keyof typeof summary.byPriority
          ]++;
        }
      });

      setTaskSummary(summary);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "text-red-600";
      case "Medium":
        return "text-yellow-600";
      default:
        return "text-green-600";
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="mb-6 mt-12 h-8 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-700 md:mt-0"></div>

        {/* Task Summary Skeleton */}
        <section className="mb-8">
          <div className="mb-4 h-7 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
          <SummarySkeleton />
        </section>

        {/* Tasks List Skeleton */}
        <section className="mt-8">
          <div className="mb-4 h-7 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
          <TasksSkeleton />
        </section>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 mt-12 text-2xl font-bold md:mt-0">My Dashboard</h1>

      {/* Task Summary Cards */}
      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">Task Summary</h2>
        <div className="mb-6">
          <Card className="bg-blue-50">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-blue-700">
                Total Tasks
              </h3>
              <p className="mt-2 text-3xl font-bold text-blue-600">
                {taskSummary.total}
              </p>
            </div>
          </Card>
        </div>

        {/* Status Summary */}
        <h3 className="mb-2 text-lg font-semibold">By Status</h3>
        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <Card className="bg-yellow-50">
            <div className="text-center">
              <h4 className="text-md font-semibold text-yellow-700">Pending</h4>
              <p className="mt-2 text-2xl font-bold text-yellow-600">
                {taskSummary.byStatus.Pending}
              </p>
            </div>
          </Card>
          <Card className="bg-blue-50">
            <div className="text-center">
              <h4 className="text-md font-semibold text-blue-700">
                In Progress
              </h4>
              <p className="mt-2 text-2xl font-bold text-blue-600">
                {taskSummary.byStatus["In Progress"]}
              </p>
            </div>
          </Card>
          <Card className="bg-green-50">
            <div className="text-center">
              <h4 className="text-md font-semibold text-green-700">
                Completed
              </h4>
              <p className="mt-2 text-2xl font-bold text-green-600">
                {taskSummary.byStatus.Completed}
              </p>
            </div>
          </Card>
        </div>

        {/* Priority Summary */}
        <h3 className="mb-2 text-lg font-semibold">By Priority</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="bg-green-50">
            <div className="text-center">
              <h4 className="text-md font-semibold text-green-700">
                Low Priority
              </h4>
              <p className="mt-2 text-2xl font-bold text-green-600">
                {taskSummary.byPriority.Low}
              </p>
            </div>
          </Card>
          <Card className="bg-yellow-50">
            <div className="text-center">
              <h4 className="text-md font-semibold text-yellow-700">
                Medium Priority
              </h4>
              <p className="mt-2 text-2xl font-bold text-yellow-600">
                {taskSummary.byPriority.Medium}
              </p>
            </div>
          </Card>
          <Card className="bg-red-50">
            <div className="text-center">
              <h4 className="text-md font-semibold text-red-700">
                High Priority
              </h4>
              <p className="mt-2 text-2xl font-bold text-red-600">
                {taskSummary.byPriority.High}
              </p>
            </div>
          </Card>
        </div>
      </section>

      {/* All Tasks Section */}
      <section className="mt-8">
        <h2 className="mb-4 text-xl font-semibold">All My Tasks</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tasks.map((task) => (
            <Card key={task.id} className="relative">
              <div
                className={`absolute right-2 top-2 rounded-full px-3 py-1 text-sm ${getStatusColor(task.status)}`}
              >
                {task.status}
              </div>

              <h5 className="mt-4 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                {task.title}
              </h5>

              <p className="font-normal text-gray-700 dark:text-gray-400">
                {task.description}
              </p>

              <div className="mt-2 space-y-1">
                <p>
                  <strong>Due Date:</strong>{" "}
                  {new Date(task.due_date).toLocaleDateString()}
                </p>
                <p>
                  <strong>Priority:</strong>{" "}
                  <span className={getPriorityColor(task.priority)}>
                    {task.priority}
                  </span>
                </p>
                {task.comments && (
                  <p>
                    <strong>Comments:</strong> {task.comments}
                  </p>
                )}
              </div>
            </Card>
          ))}
        </div>

        {tasks.length === 0 && (
          <p className="text-center text-gray-500">No tasks assigned.</p>
        )}
      </section>
    </div>
  );
};

export default UserDashboard;
