import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserServer } from "@/Utils/server/auth";
import db from "@/Utils/db";

// GET: Obtener todas las tareas
export async function GET() {
  try {
    const currentUser = await getCurrentUserServer();

    if (!currentUser) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    if (currentUser.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const tasks = db
      .prepare(
        `
        SELECT * FROM tasks_with_users 
        ORDER BY created_at DESC
      `,
      )
      .all();

    return NextResponse.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 },
    );
  }
}

// POST: Crear una nueva tarea
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      user_id,
      assigned_to,
      due_date,
      priority,
      status,
      comments,
    } = body;

    if (!user_id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 },
      );
    }

    const result = db
      .prepare(
        `
        INSERT INTO tasks (
          title, description, user_id, assigned_to, 
          due_date, priority, status, comments
        ) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      )
      .run([
        title,
        description,
        user_id,
        assigned_to,
        due_date,
        priority,
        status,
        comments,
      ]);

    // Fetch the newly created task with user details
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

// PUT: Actualizar una tarea existente
export async function PUT(req: Request) {
  try {
    const {
      id,
      title,
      description,
      assigned_to,
      due_date,
      priority,
      status,
      comments,
    } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "El ID de la tarea es requerido" },
        { status: 400 },
      );
    }

    const statement = db.prepare(`
      UPDATE tasks
      SET title = ?, description = ?, assigned_to = ?, due_date = ?, priority = ?, status = ?, comments = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    const result = statement.run(
      title,
      description,
      assigned_to,
      due_date,
      priority,
      status,
      comments,
      id,
    );

    if (result.changes === 0) {
      return NextResponse.json(
        { error: "No se encontró la tarea para actualizar" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al actualizar la tarea" },
      { status: 500 },
    );
  }
}

// DELETE: Eliminar una tarea por ID
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "El ID de la tarea es requerido" },
        { status: 400 },
      );
    }

    const statement = db.prepare("DELETE FROM tasks WHERE id = ?");
    const result = statement.run(id);

    if (result.changes === 0) {
      return NextResponse.json(
        { error: "No se encontró la tarea para eliminar" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al eliminar la tarea" },
      { status: 500 },
    );
  }
}
