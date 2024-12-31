// __tests__/api/auth/route.test.ts
import { POST } from "@/app/api/auth/route";
import { usersAdapter } from "@/adapters/usersAdapter";
// Helper function to create a valid user credentials
const createValidCredentials = () => ({
  username: "admin",
  password: "admin123",
});

// Mock the usersAdapter for testing
jest.mock("@/adapters/usersAdapter");

describe("API: /api/auth", () => {
  it("POST /api/auth should authenticate a user with valid credentials", async () => {
    const validCredentials = createValidCredentials();

    // Mock the validateUser function to return a user object
    (usersAdapter.validateUser as jest.Mock).mockResolvedValueOnce({
      username: validCredentials.username,
      role: "admin",
    });

    // Send POST request to authenticate the user
    const request = new Request("http://localhost:3001/api/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validCredentials),
    });

    const response = await POST(request);
    const responseBody = await response.json();

    // Validate the response status and content
    expect(response.status).toBe(200); // Expect a 200 OK status
    expect(responseBody.success).toBe(true); // Expect success to be true
    expect(responseBody.data.username).toBe(validCredentials.username); // Expect the returned user to match the valid credentials
  });

  it("POST /api/auth should return 401 for invalid credentials", async () => {
    const invalidCredentials = createValidCredentials();

    // Mock the validateUser function to return null for invalid credentials
    (usersAdapter.validateUser as jest.Mock).mockResolvedValueOnce(null);

    // Send POST request with invalid credentials
    const request = new Request("http://localhost:3001/api/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(invalidCredentials),
    });

    const response = await POST(request);
    const responseBody = await response.json();

    // Validate the response status and content
    expect(response.status).toBe(401); // Expect a 401 Unauthorized status
    expect(responseBody.success).toBe(false); // Expect success to be false
    expect(responseBody.message).toBe("Invalid username or password."); // Expect the error message
  });

  it("POST /api/auth should handle server errors", async () => {
    const validCredentials = createValidCredentials();

    // Mock the validateUser function to throw an error
    (usersAdapter.validateUser as jest.Mock).mockRejectedValueOnce(
      new Error("Database error"),
    );

    // Send POST request to authenticate the user
    const request = new Request("http://localhost:3001/api/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validCredentials),
    });

    const response = await POST(request);
    const responseBody = await response.json();

    // Validate the response status and content
    expect(response.status).toBe(500); // Expect a 500 Internal Server Error status
    expect(responseBody.success).toBe(false); // Expect success to be false
    expect(responseBody.message).toBe("Database error"); // Expect the error message
  });
});
