import { NextRequest, NextResponse } from "next/server";
import db from "@/Utils/db";

// GET: Obtener una tarea específica por ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const taskId = params.id;

    const task = db
      .prepare("SELECT * FROM tasks_with_users WHERE id = ?")
      .get(taskId);

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json(task);
  } catch (error) {
    console.error("Error fetching task:", error);
    return NextResponse.json(
      { error: "Failed to fetch task" },
      { status: 500 },
    );
  }
}

// PUT: Actualizar una tarea específica por ID
export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    // No need to await params.id as it's already a string
    const taskId = params.id;
    const body = await request.json();
    const { status } = body;

    // Validate the status
    const validStatuses = ["pending", "in progress", "completed"];
    if (!validStatuses.includes(status.toLowerCase())) {
      return NextResponse.json(
        { error: "Invalid status value" },
        { status: 400 },
      );
    }

    // Only update the status and updated_at fields
    const result = db
      .prepare(
        `
      UPDATE tasks 
      SET status = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
      )
      .run([status.toLowerCase(), taskId]);

    if (result.changes === 0) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // Fetch the updated task with user details
    const updatedTask = db
      .prepare("SELECT * FROM tasks_with_users WHERE id = ?")
      .get(taskId);

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error("Error updating task status:", error);
    return NextResponse.json(
      { error: "Failed to update task status" },
      { status: 500 },
    );
  }
}

// PUT: Update task status
export async function UPDATE(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const taskId = params.id;
    const { status } = await request.json();

    // Validate the status
    const validStatuses = ["pending", "in progress", "completed"];
    if (!validStatuses.includes(status.toLowerCase())) {
      return NextResponse.json(
        { error: "Invalid status value" },
        { status: 400 },
      );
    }

    db.prepare(
      `
      UPDATE tasks 
      SET status = ?, 
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
    ).run(status.toLowerCase(), taskId);

    // Fetch the updated task with user details
    const updatedTask = db
      .prepare("SELECT * FROM tasks_with_users WHERE id = ?")
      .get(taskId);

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error("Error updating task status:", error);
    return NextResponse.json(
      { error: "Failed to update task status" },
      { status: 500 },
    );
  }
}

// DELETE: Eliminar una tarea específica por ID
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const taskId = params.id;

    const result = db.prepare("DELETE FROM tasks WHERE id = ?").run(taskId);

    if (result.changes === 0) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json(
      { error: "Failed to delete task" },
      { status: 500 },
    );
  }
}
