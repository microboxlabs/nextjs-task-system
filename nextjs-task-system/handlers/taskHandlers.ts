import { tasksAdapter } from "@/adapters/tasksAdapter";
import { taskSchema, updateTaskSchema } from "@/schemas/taskSchema";
import { handleValidationError, handleGeneralError } from "@/utils/errorUtils";
import { validateInput } from "@/utils/validationUtils";

// Fetch all tasks
export async function getTasksHandler() {
  try {
    const tasks = await tasksAdapter.fetchTasks();
    return {
      status: 200,
      json: {
        success: true,
        message: "Tasks fetched successfully",
        data: tasks,
      },
    };
  } catch (error) {
    return handleGeneralError(error);
  }
}

// Fetch a single task by ID
export async function getTaskHandler(id: string) {
  try {
    const task = await tasksAdapter.getTaskById(Number(id));

    return {
      status: 200,
      json: {
        success: true,
        message: "Task found successfully",
        data: task,
      },
    };
  } catch (error) {
    return handleGeneralError(error);
  }
}

// Create a new task
export async function createTaskHandler(data: any) {
  const validationError = validateInput(taskSchema, data);
  if (validationError) {
    return handleValidationError(validationError);
  }

  try {
    const newTask = await tasksAdapter.createTask(data);
    return {
      status: 201,
      json: {
        success: true,
        message: "Task created successfully",
        data: newTask,
      },
    };
  } catch (error) {
    return handleGeneralError(error);
  }
}

// Update an existing task
export async function updateTaskHandler(id: string, data: any) {
  const validationError = validateInput(updateTaskSchema, data);
  if (validationError) {
    return handleValidationError(validationError);
  }

  try {
    const updatedTask = await tasksAdapter.updateTask(Number(id), data);

    return {
      status: 200,
      json: {
        success: true,
        message: "Task updated successfully",
        data: updatedTask,
      },
    };
  } catch (error) {
    return handleGeneralError(error);
  }
}

// Delete a task by ID
export async function deleteTaskHandler(id: string) {
  try {
    await tasksAdapter.deleteTask(Number(id));

    return {
      status: 200,
      json: {
        success: true,
        message: "Task deleted successfully",
      },
    };
  } catch (error) {
    return handleGeneralError(error);
  }
}
