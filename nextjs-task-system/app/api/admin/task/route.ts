import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/utils/prisma";
import { authorizeUser } from "@/utils/authUtils";

// Obtener todas las tareas (GET)
export async function GET(req: NextRequest) {
  try {
    const { status, response } = await authorizeUser('admin');

    if (status !== 200) {
      return response;
    }

    const tasks = await prisma.task.findMany();
    return NextResponse.json(tasks, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Could not retrieve tasks" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(req: NextRequest) {
  try {
    const { status, response } = await authorizeUser('admin');

    if (status !== 200) {
      return response;
    }

    const body = await req.json();
    const { title, description, assignedTo, dueDate, priority, idAssignedTo } = body;

    if (!title || !assignedTo || !dueDate || !priority || !idAssignedTo) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await prisma.task.create({
      data: {
        title: title,
        description: description,
        assignedTo: assignedTo,
        idAssignedTo: idAssignedTo,
        dueDate: dueDate,
        priority: priority,
        creationDate: new Date().toISOString()
      }
    })

    return NextResponse.json({ message: "Task created successfully" }, { status: 201 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Could not insert task" }, { status: 500 });
  } finally {
    await prisma.$disconnect()
  }
}

// Eliminar una tarea (DELETE)
export async function DELETE(req: NextRequest) {
  try {
    const { status, response } = await authorizeUser('admin');

    if (status !== 200) {
      return response;
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: "Task ID is required" }, { status: 400 });
    }

    await prisma.task.delete({
      where: {
        id: Number(id)
      }
    })

    return NextResponse.json({ message: "Task deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Could not delete task" }, { status: 500 });
  } finally {
    await prisma.$disconnect()
  }
}

// Actualizar una tarea (PUT)
export async function PUT(req: NextRequest) {
  try {
    const { status:resStatus, response } = await authorizeUser('admin');

    if (resStatus !== 200) {
      return response;
    }

    const body = await req.json();
    const { id, title, description, assignedTo, dueDate, priority, status, comments, idAssignedTo } = body;

    if (!id || !title || !description || !assignedTo || !dueDate || !priority || !status || !idAssignedTo) {
      return NextResponse.json({ error: "Task ID is required" }, { status: 400 });
    }

    const taskUpdated = await prisma.task.update({
      where: { id },
      data: {
        title,
        description,
        assignedTo,
        idAssignedTo,
        dueDate,
        priority,
        status,
        comments
      },
    });

    return NextResponse.json({ message: "Task updated successfully", taskUpdated }, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Could not update task" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}