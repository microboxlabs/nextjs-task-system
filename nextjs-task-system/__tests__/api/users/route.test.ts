import { GET } from "@/app/api/users/route";
import { getUsersHandler } from "@/handlers/userHandlers";

// Mock the getUsersHandler function
jest.mock("@/handlers/userHandlers");

describe("GET /api/users", () => {
  it("should return a list of users", async () => {
    // Test data
    const mockUsers = [
      { id: 1, name: "John Doe" },
      { id: 2, name: "Jane Doe" },
    ];

    // Set up the mock to return the test data
    (getUsersHandler as jest.Mock).mockResolvedValue({
      status: 200,
      json: {
        success: true,
        message: "Users fetched successfully",
        data: mockUsers,
      },
    });

    // Perform the GET request
    const response = await GET();

    // Verify that the response is correct
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      success: true,
      message: "Users fetched successfully",
      data: mockUsers,
    });
    expect(getUsersHandler).toHaveBeenCalledTimes(1);
  });

  it("should handle errors correctly", async () => {
    // Set up the mock to return an error
    (getUsersHandler as jest.Mock).mockResolvedValue({
      status: 500,
      json: {
        success: false,
        message: "Failed to fetch users",
      },
    });

    // Perform the GET request
    const response = await GET();

    // Verify that the response is an error
    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({
      success: false,
      message: "Failed to fetch users",
    });
  });
});
