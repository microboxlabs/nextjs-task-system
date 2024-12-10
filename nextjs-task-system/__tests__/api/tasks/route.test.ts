import { GET, POST } from "@/app/api/tasks/route";
import { Task } from "@/types/taskTypes";

// Helper function to create a valid task
const createValidTask = (): Omit<Task, "id"> => ({
  title: "Test Task",
  description: "This is a test task",
  status: "pending",
  dueDate: "2024-12-31",
  assignedTo: "Test User",
  priority: "medium",
  comments: ["Test comment"],
});

describe("API: /api/tasks", () => {
  it("GET /api/tasks should return all tasks", async () => {
    // Send GET request to fetch all tasks
    const response = await GET();
    const responseBody = await response.json();

    // Validate the response status and content
    expect(response.status).toBe(200); // Expect a 200 OK status
    expect(responseBody.success).toBe(true); // Expect success to be true
    expect(Array.isArray(responseBody.data)).toBe(true); // Expect data to be an array
    expect(responseBody.data.length).toBeGreaterThan(0); // Expect at least one task
  });

  it("POST /api/tasks should create a new task", async () => {
    const newTask = createValidTask(); // Create a valid task

    // Send POST request to create a new task
    const request = new Request("http://localhost:3001/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTask),
    });

    const response = await POST(request);
    const responseBody = await response.json();

    // Validate the response status and content
    expect(response.status).toBe(201); // Expect a 201 Created status
    expect(responseBody.success).toBe(true); // Expect success to be true
    expect(responseBody.data).toMatchObject(newTask); // Expect the returned task to match the new task
    expect(responseBody.data).toHaveProperty("id"); // Expect the returned task to have an ID
  });

  it("POST /api/tasks should handle invalid task data", async () => {
    const invalidTask = { title: "Incomplete Task" }; // Missing required fields

    // Send POST request with invalid task data
    const request = new Request("http://localhost:3001/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(invalidTask), // Send incomplete task
    });

    const response = await POST(request);
    const responseBody = await response.json();

    // Validate the response status and content
    expect(response.status).toBe(400); // Expect a 400 Bad Request status due to validation errors
    expect(responseBody.success).toBe(false); // Expect success to be false
    expect(responseBody.errors).toBeDefined(); // Expect an errors object to be present
  });
});
