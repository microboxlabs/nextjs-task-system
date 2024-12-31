// handlers\authHandlers.ts
import { usersAdapter } from "@/adapters/usersAdapter";
import { authenticateUserSchema } from "@/schemas/authSchema";
import {
  handleAuthError,
  handleGeneralError,
  handleValidationError,
  validateInput,
} from "@/utils";

export async function authenticateUser(
  request: Request,
): Promise<{ status: number; json: any }> {
  const body = await request.json();
  console.log("Request body for new task:", body);

  const validationError = validateInput(authenticateUserSchema, body);
  if (validationError) {
    return handleValidationError(validationError);
  }

  try {
    const { username, password } = body;
    const user = await usersAdapter.validateUser(username, password);

    if (!user) {
      return handleAuthError();
    }

    const result = {
      status: 200,
      json: {
        success: true,
        message: "User authenticated successfully",
        data: user,
      },
    };

    console.log("User authenticated result:", result);
    return result;
  } catch (error) {
    console.error("Error during authentication:", error);
    return handleGeneralError(error);
  }
}
