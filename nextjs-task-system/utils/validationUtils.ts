import { ZodError } from "zod";

// Formats a validation error response from a ZodError object.
export function formatValidationErrorResponse(
  error: ZodError,
  message?: string,
): any {
  return {
    success: false,
    message: message ?? "Invalid request body",
    errors: error.flatten().fieldErrors,
  };
}

// Validates input using a Zod schema and returns an error object if validation fails.
export function validateInput(schema: any, data: any) {
  const parsedData = schema.safeParse(data);
  if (!parsedData.success) {
    return parsedData.error;
  }
  return null;
}
