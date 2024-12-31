import { tasksAdapter } from "@/adapters/tasksAdapter";
import { createTaskSchema, updateTaskSchema } from "@/schemas/taskSchema";
import {
  handleGeneralError,
  handleValidationError,
  validateInput,
} from "@/utils";

export async function getTasksHandler() {
  try {
    const tasks = await tasksAdapter.fetchTasks();
    console.log("Fetched tasks:", JSON.stringify(tasks, null, 2));

    const result = {
      status: 200,
      json: {
        success: true,
        message: "Tasks fetched successfully",
        data: tasks,
      },
    };
    console.log("Tasks fetched result:", result);
    return result;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return handleGeneralError(error);
  }
}

export async function getTaskHandler(request: Request, { id }: { id: string }) {
  if (!id) {
    return handleGeneralError(new Error("Task ID is required"));
  }

  try {
    const taskId = Number(id);
    if (isNaN(taskId)) {
      throw new Error("Invalid task ID");
    }
    console.log(`Fetching task with ID: ${taskId}`);
    const task = await tasksAdapter.getTaskById(taskId);
    console.log("Fetched task:", JSON.stringify(task, null, 2));

    const result = {
      status: 200,
      json: {
        success: true,
        message: "Task found successfully",
        data: task,
      },
    };
    console.log("Fetch task result:", result);
    return result;
  } catch (error) {
    console.error("Error fetching task:", error);
    return handleGeneralError(error);
  }
}

export async function createTaskHandler(request: Request) {
  const body = await request.json();
  console.log("Request body for new task:", body);

  const validationError = validateInput(createTaskSchema, body);
  if (validationError) {
    return handleValidationError(validationError);
  }

  try {
    const newTask = await tasksAdapter.createTask(body);
    console.log("Created task:", JSON.stringify(newTask, null, 2));

    const result = {
      status: 201,
      json: {
        success: true,
        message: "Task created successfully",
        data: newTask,
      },
    };
    console.log("Create task result:", result);
    return result;
  } catch (error) {
    console.error("Error creating task:", error);
    return handleGeneralError(error);
  }
}

export async function updateTaskHandler(
  request: Request,
  { id }: { id: string },
) {
  if (!id) {
    return handleGeneralError(new Error("Task ID is required"));
  }

  const body = await request.json();
  console.log("Request body for updating task:", body);

  const validationError = validateInput(updateTaskSchema, body);
  if (validationError) {
    return handleValidationError(validationError);
  }

  try {
    const updatedTask = await tasksAdapter.updateTask(Number(id), body);
    console.log("Updated task:", JSON.stringify(updatedTask, null, 2));

    const result = {
      status: 200,
      json: {
        success: true,
        message: "Task updated successfully",
        data: updatedTask,
      },
    };
    console.log("Update task result:", result);
    return result;
  } catch (error) {
    console.error("Error updating task:", error);
    return handleGeneralError(error);
  }
}

export async function deleteTaskHandler(
  request: Request,
  { id }: { id: string },
) {
  if (!id) {
    return handleGeneralError(new Error("Task ID is required"));
  }

  try {
    await tasksAdapter.deleteTask(Number(id));
    const result = {
      status: 200,
      json: {
        success: true,
        message: "Task deleted successfully",
      },
    };
    console.log("Delete task result:", result);
    return result;
  } catch (error) {
    console.error("Error deleting task:", error);
    return handleGeneralError(error);
  }
}
