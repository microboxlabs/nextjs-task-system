import { NextRequest, NextResponse } from "next/server";
import db from "@/Utils/db";

interface RouteParams {
  params: {
    id: string;
  };
}

export async function PUT(request: NextRequest, context: RouteParams) {
  try {
    const taskId = context.params.id;
    const body = await request.json();
    const { status, comments } = body;

    // Validate the status
    const validStatuses = ["pending", "in progress", "completed"];
    if (!validStatuses.includes(status.toLowerCase())) {
      return NextResponse.json(
        { error: "Invalid status value" },
        { status: 400 },
      );
    }

    // Update both status and comments
    const result = db
      .prepare(
        `UPDATE tasks 
         SET status = ?,
             comments = ?,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
      )
      .run([status.toLowerCase(), comments, taskId]);

    if (result.changes === 0) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // Fetch the updated task with user details
    const updatedTask = db
      .prepare("SELECT * FROM tasks_with_users WHERE id = ?")
      .get(taskId);

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest, context: RouteParams) {
  try {
    const taskId = context.params.id;

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

export async function DELETE(request: NextRequest, context: RouteParams) {
  try {
    const taskId = context.params.id;

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
