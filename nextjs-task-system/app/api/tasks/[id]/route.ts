import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, description, assignedTo, dueDate, priority, status } =
      await req.json();

    if (!params.id) {
      return NextResponse.json(
        { error: "Task ID is required" },
        { status: 400 },
      );
    }

    if (
      !Array.isArray(assignedTo) ||
      assignedTo.some(
        (item) =>
          !(item.type === "user" || item.type === "group") ||
          (item.type === "user" && typeof item.userId === "undefined") ||
          (item.type === "group" && typeof item.groupId === "undefined"),
      )
    ) {
      return NextResponse.json(
        { error: "Invalid assignedTo format" },
        { status: 400 },
      );
    }

    const taskIdInt = parseInt(params.id);

    const task = await prisma.task.findUnique({
      where: { id: taskIdInt },
      include: { assignments: true },
    });

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const currentAssignments = task.assignments;

    const toDelete = currentAssignments.filter(
      (assignment) =>
        !assignedTo.some(
          (newAssignment) =>
            (assignment.userId === newAssignment.userId &&
              newAssignment.type === "user") ||
            (assignment.groupId === newAssignment.groupId &&
              newAssignment.type === "group"),
        ),
    );

    const toAdd = assignedTo.filter(
      (newAssignment) =>
        !currentAssignments.some(
          (assignment) =>
            (assignment.userId === newAssignment.userId &&
              newAssignment.type === "user") ||
            (assignment.groupId === newAssignment.groupId &&
              newAssignment.type === "group"),
        ),
    );

    await prisma.taskAssignment.deleteMany({
      where: { id: { in: toDelete.map((assignment) => assignment.id) } },
    });

    await prisma.taskAssignment.createMany({
      data: toAdd.map((newAssignment) => ({
        taskId: taskIdInt,
        userId:
          newAssignment.type === "user" ? newAssignment.userId : undefined,
        groupId:
          newAssignment.type === "group" ? newAssignment.groupId : undefined,
      })),
    });

    const updatedTask = await prisma.task.update({
      where: { id: taskIdInt },
      data: {
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        priority,
        status,
      },
      include: {
        assignments: {
          select: {
            user: {
              select: {
                id: true,
                email: true,
                name: true,
                role: true,
              },
            },
            group: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(updatedTask, { status: 200 });
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  const { id } = params;

  try {
    const taskId = parseInt(id, 10);

    if (isNaN(taskId)) {
      return NextResponse.json({ error: "Invalid task ID" }, { status: 400 });
    }

    const deletedTask = await prisma.task.delete({
      where: { id: taskId },
    });

    return NextResponse.json(
      { message: "Task deleted successfully", deletedTask },
      { status: 200 },
    );
  } catch (error: any) {
    if (error.code === "P2025") {
      // prisma code when task if not found
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
