"use server"
import React from 'react'
import { getServerSession } from 'next-auth';
import { authOptions } from '@/libs/auth';
import { prisma } from "@/libs/prisma"
import TaskClient from './TaskClient';

type Task = {
  id: number;
  title: string;
  assignedToId: number | null;
  group: string | null;
  description: string;
  dueDate: Date | null;
  priority: string;
  status: string;
  isAdmin?: boolean
  createdAt: Date;
  updatedAt: Date;
};

export default async function TableView() {
  // Fetch the session data, which includes user info and authentication state
  const session = await getServerSession(authOptions);

  // Check if the logged-in user is an admin. If so, they will have access to all tasks.
  const isAdmin = session?.user.isAdmin;

  // Get the user ID from the session for non-admin users (to fetch their assigned tasks).
  const userId = session?.user.id;

  let tasks: Task[] = [];

  // If the user is an admin, fetch all tasks, including the 'assignedTo' field (user info).
  if (isAdmin) {
    tasks = await prisma.task.findMany({
      include: {
        assignedTo: true,
      },
    });

    // If the user is not an admin and has an ID, fetch tasks assigned to that user.
  } else if (userId) {
    const numericUserId = parseInt(userId, 10); // Convert the userId to a number for the query
    tasks = await prisma.task.findMany({
      where: { assignedToId: numericUserId } // Fetch tasks where the assignedToId matches the user's ID
    });
  }

  return (
    <TaskClient tasks={tasks} isAdmin={isAdmin} />
  )
}
