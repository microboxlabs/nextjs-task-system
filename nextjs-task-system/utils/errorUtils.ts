import { formatValidationErrorResponse } from "./validationUtils";

// Function to handle errors, checking if it is a 404 error.
export function handleGeneralError(error: any) {
  if ((error as Error).message === "Task not found") {
    return handleNotFoundError();
  }
  return handleServerError(error);
}

export function handleValidationError(error: any) {
  return {
    status: 400,
    json: formatValidationErrorResponse(error),
  };
}

export function handleNotFoundError() {
  return {
    status: 404,
    json: {
      success: false,
      message: "Task not found",
    },
  };
}

export function handleServerError(error: any) {
  return {
    status: 500,
    json: {
      success: false,
      message: (error as Error).message,
    },
  };
}

export function handleAuthError() {
  return {
    status: 401,
    json: {
      success: false,
      message: "Invalid username or password.",
    },
  };
}
