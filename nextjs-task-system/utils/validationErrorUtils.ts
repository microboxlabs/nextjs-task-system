import { ZodError } from "zod";

export function formatValidationErrorResponse(error: ZodError): any {
  return {
    success: false,
    message: "Validation error",
    errors: error.flatten().fieldErrors,
  };
}
