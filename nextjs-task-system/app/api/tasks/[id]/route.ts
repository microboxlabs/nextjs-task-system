import { NextResponse } from "next/server";
import { tasksAdapter } from "@/adapters/tasksAdapter";
import { updateTaskSchema } from "@/schemas/taskSchema";
import { formatValidationErrorResponse } from "@/utils/validationErrorUtils";

export async function GET({ params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);

    const task = await tasksAdapter.getTaskById(id);

    return NextResponse.json({
      success: true,
      message: "Task found successfully",
      data: task,
    });
  } catch (error) {
    // Handle error if the task is not found
    if ((error as Error).message === "Task not found") {
      return NextResponse.json(
        { success: false, message: "Task not found" },
        { status: 404 },
      );
    }

    // For other errors, return a general error response
    return NextResponse.json(
      { success: false, message: (error as Error).message },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const body = await request.json();

    // Input validation using updateTaskSchema
    const parsedBody = updateTaskSchema.safeParse(body);
    if (!parsedBody.success) {
      return NextResponse.json(
        formatValidationErrorResponse(parsedBody.error),
        { status: 400 },
      );
    }

    // Passing the validated data to the adapter to update the task
    const updatedTask = await tasksAdapter.updateTask(
      Number(params.id),
      parsedBody.data,
    );

    // If no task is updated (i.e., the task does not exist), return 404
    if (!updatedTask) {
      return NextResponse.json(
        { success: false, message: "Task not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Task updated successfully",
      data: updatedTask,
    });
  } catch (error) {
    // Check if the error is related to "Task not found" and return 404
    if ((error as Error).message === "Task not found") {
      return NextResponse.json(
        { success: false, message: "Task not found" },
        { status: 404 },
      );
    }

    // For other errors, return 500 Internal Server Error
    return NextResponse.json(
      { success: false, message: (error as Error).message },
      { status: 500 },
    );
  }
}

export async function DELETE({ params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);

    // Passing the validated id to the adapter to delete the task
    await tasksAdapter.deleteTask(Number(id));
    return NextResponse.json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    // Handle task not found error
    if ((error as Error).message === "Task not found") {
      return NextResponse.json(
        { success: false, message: "Task not found" },
        { status: 404 },
      );
    }
    // General error handling: return a 500 status code if an error occurs
    return NextResponse.json(
      { success: false, message: (error as Error).message },
      { status: 500 },
    );
  }
}
