import { NextResponse } from "next/server";
import { tasksAdapter } from "@/adapters/tasksAdapter";

export async function GET() {
  try {
    const tasks = await tasksAdapter.fetchTasks();
    return NextResponse.json({ success: true, data: tasks });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newTask = await tasksAdapter.createTask(body);
    return NextResponse.json({ success: true, data: newTask }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updatedData } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Task ID is required" },
        { status: 400 },
      );
    }

    const updatedTask = await tasksAdapter.updateTask(Number(id), updatedData);
    return NextResponse.json({ success: true, data: updatedTask });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Task ID is required" },
        { status: 400 },
      );
    }

    await tasksAdapter.deleteTask(Number(id));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 },
    );
  }
}
