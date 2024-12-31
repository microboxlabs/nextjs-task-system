// handlers/userHandlers.ts
import { usersAdapter } from "@/adapters/usersAdapter";
import { handleGeneralError } from "@/utils";

export async function getUsersHandler() {
  try {
    const users = await usersAdapter.getUsers();
    console.log("Fetched users:", JSON.stringify(users, null, 2));

    const result = {
      status: 200,
      json: {
        success: true,
        message: "Users fetched successfully",
        data: users,
      },
    };
    console.log("Users fetched result:", result);
    return result;
  } catch (error) {
    console.error("Error fetching users:", error);
    return handleGeneralError(error);
  }
}
