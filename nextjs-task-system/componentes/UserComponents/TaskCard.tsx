"use client";
import React from "react";
import { Card, Badge } from "flowbite-react";

type TaskCardProps = {
  task: {
    id: number;
    title: string;
    description: string;
    assigned_to: number;
    due_date: string;
    priority: string;
    status: string;
    comments?: string;
  };
  variant?: "user" | "admin";
};

const TaskCard = ({ task, variant = "user" }: TaskCardProps) => {
  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "failure";
      case "medium":
        return "warning";
      case "low":
        return "success";
      default:
        return "info";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "success";
      case "in progress":
        return "warning";
      case "pending":
        return "gray";
      default:
        return "info";
    }
  };

  if (variant === "user") {
    return (
      <Card className="mb-4">
        <div className="flex justify-between">
          <h5 className="text-xl font-bold">{task.title}</h5>
          <div className="flex gap-2">
            <Badge color={getPriorityColor(task.priority)}>
              {task.priority}
            </Badge>
            <Badge color={getStatusColor(task.status)}>{task.status}</Badge>
          </div>
        </div>
        <p className="text-gray-700">{task.description}</p>
        <div className="mt-4 text-sm text-gray-600">
          <p>Due: {new Date(task.due_date).toLocaleDateString()}</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="mb-4">
      <div className="flex justify-between">
        <h5 className="text-xl font-bold">{task.title}</h5>
        <div className="flex gap-2">
          <Badge color={getPriorityColor(task.priority)}>{task.priority}</Badge>
          <Badge color={getStatusColor(task.status)}>{task.status}</Badge>
        </div>
      </div>
      <p className="text-gray-700">{task.description}</p>
      <div className="mt-4 text-sm text-gray-600">
        <p>Assigned to: User {task.assigned_to}</p>
        <p>Due: {new Date(task.due_date).toLocaleDateString()}</p>
        {task.comments && <p className="mt-2">Comments: {task.comments}</p>}
      </div>
    </Card>
  );
};

export default TaskCard;
