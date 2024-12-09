"use client";
import { useState, useEffect } from "react";
import { Card } from "flowbite-react";
import DashboardSkeleton from "@/components/Skeletons/DashboardSkeleton";
import { Task } from "@/tipos/tasks";

type TaskSummary = {
  total: number;
  byStatus: {
    pending: number;
    "in progress": number;
    completed: number;
  };
  byPriority: {
    low: number;
    medium: number;
    high: number;
  };
};

export default function AdminDashboard() {
  const [taskSummary, setTaskSummary] = useState<TaskSummary>({
    total: 0,
    byStatus: {
      pending: 0,
      "in progress": 0,
      completed: 0,
    },
    byPriority: {
      low: 0,
      medium: 0,
      high: 0,
    },
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/tasks");
      const tasks: Task[] = await response.json();

      const summary: TaskSummary = {
        total: tasks.length,
        byStatus: {
          pending: 0,
          "in progress": 0,
          completed: 0,
        },
        byPriority: {
          low: 0,
          medium: 0,
          high: 0,
        },
      };

      tasks.forEach((task) => {
        // Count by status
        if (summary.byStatus.hasOwnProperty(task.status)) {
          summary.byStatus[task.status as keyof typeof summary.byStatus]++;
        }

        // Count by priority
        if (summary.byPriority.hasOwnProperty(task.priority)) {
          summary.byPriority[
            task.priority as keyof typeof summary.byPriority
          ]++;
        }
      });

      setTaskSummary(summary);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      {isLoading ? (
        <DashboardSkeleton />
      ) : (
        <>
          <h1 className="mb-6 mt-12 text-3xl font-bold md:mt-0">
            Task Management Dashboard
          </h1>

          {/* Total Tasks Card */}
          <div className="mb-8">
            <Card>
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  Total Tasks
                </h2>
                <p className="mt-4 text-4xl font-bold text-blue-600">
                  {taskSummary.total}
                </p>
              </div>
            </Card>
          </div>

          {/* Status Summary */}
          <h2 className="mb-4 text-xl font-semibold">Tasks by Status</h2>
          <div className="mb-8 grid gap-4 md:grid-cols-3">
            <Card className="bg-yellow-50">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-yellow-700">
                  Pending
                </h3>
                <p className="mt-2 text-3xl font-bold text-yellow-600">
                  {taskSummary.byStatus.pending}
                </p>
              </div>
            </Card>
            <Card className="bg-blue-50">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-blue-700">
                  in progress
                </h3>
                <p className="mt-2 text-3xl font-bold text-blue-600">
                  {taskSummary.byStatus["in progress"]}
                </p>
              </div>
            </Card>
            <Card className="bg-green-50">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-green-700">
                  completed
                </h3>
                <p className="mt-2 text-3xl font-bold text-green-600">
                  {taskSummary.byStatus.completed}
                </p>
              </div>
            </Card>
          </div>

          {/* Priority Summary */}
          <h2 className="mb-4 text-xl font-semibold">Tasks by Priority</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="bg-green-50">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-green-700">
                  Low Priority
                </h3>
                <p className="mt-2 text-3xl font-bold text-green-600">
                  {taskSummary.byPriority.low}
                </p>
              </div>
            </Card>
            <Card className="bg-yellow-50">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-yellow-700">
                  Medium Priority
                </h3>
                <p className="mt-2 text-3xl font-bold text-yellow-600">
                  {taskSummary.byPriority.medium}
                </p>
              </div>
            </Card>
            <Card className="bg-red-50">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-red-700">
                  High Priority
                </h3>
                <p className="mt-2 text-3xl font-bold text-red-600">
                  {taskSummary.byPriority.high}
                </p>
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
