import { NextRequest, NextResponse } from "next/server";
import db from "@/Utils/db";

interface Params {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const userId = params.id;

    // Validate userId
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 },
      );
    }

    const tasks = db
      .prepare(
        `SELECT * FROM tasks_with_users 
         WHERE assigned_to = ? 
         ORDER BY created_at DESC`,
      )
      .all(userId);

    return NextResponse.json(tasks);
  } catch (error) {
    console.error("Error fetching user tasks:", error);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest, { params }: Params) {
  try {
    const userId = params.id;

    // Validate userId
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 },
      );
    }

    const body = await request.json();
    const { title, description, due_date, priority, status, comments } = body;

    const result = db
      .prepare(
        `INSERT INTO tasks (
          title, description, user_id, assigned_to,
          due_date, priority, status, comments
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .run([
        title,
        description,
        userId,
        userId,
        due_date,
        priority.toLowerCase(),
        status.toLowerCase(),
        comments,
      ]);

    const newTask = db
      .prepare("SELECT * FROM tasks_with_users WHERE id = ?")
      .get(result.lastInsertRowid);

    return NextResponse.json(newTask);
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 },
    );
  }
}
