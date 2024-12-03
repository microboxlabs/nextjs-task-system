import { NextResponse } from "next/server";
import db from "@/Utils/db";

// GET: Obtener todas las tareas
export async function GET() {
  try {
    const tasks = db
      .prepare(
        `
        SELECT tasks.id, title, description, assigned_to, due_date, priority, status, comments
        FROM tasks
      `,
      )
      .all();
    return NextResponse.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      { error: "Error fetching tasks" },
      { status: 500 },
    );
  }
}

// POST: Crear una nueva tarea
export async function POST(req: Request) {
  try {
    const {
      title,
      description,
      assigned_to,
      due_date,
      priority,
      status,
      comments,
    } = await req.json();

    if (
      !title ||
      !description ||
      !assigned_to ||
      !due_date ||
      !priority ||
      !status
    ) {
      return NextResponse.json(
        { error: "Todos los campos requeridos deben estar completos" },
        { status: 400 },
      );
    }

    const statement = db.prepare(`
      INSERT INTO tasks (title, description, assigned_to, due_date, priority, status, comments)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    const result = statement.run(
      title,
      description,
      assigned_to,
      due_date,
      priority,
      status,
      comments,
    );

    return NextResponse.json({ id: result.lastInsertRowid });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al crear la tarea" },
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
