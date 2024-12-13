// handlers\authHandlers.ts
import { usersAdapter } from "@/adapters/usersAdapter";
import { handleAuthError, handleGeneralError } from "@/utils/errorUtils";

export async function authenticateUser(
  request: Request,
): Promise<{ status: number; json: any }> {
  const { username, password } = await request.json();

  try {
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
