import { GET, PUT, DELETE } from "@/app/api/tasks/[id]/route";
import { GET as GETAll, POST } from "@/app/api/tasks/route";

// Helper function to create a valid task
const createValidTask = () => ({
  title: "Test Task",
  description: "This is a test task",
  dueDate: "2024-12-31",
  assignedTo: { type: "user", id: 1 },
  priority: "medium",
});

describe("API: /api/tasks", () => {
  let createdTaskId: number;

  beforeAll(async () => {
    // Create a task for use in tests
    const newTask = createValidTask();
    const request = new Request("http://localhost:3001/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTask),
    });

    const response = await POST(request);
    const responseBody = await response.json();
    createdTaskId = responseBody.data.id;
  });

  afterAll(async () => {
    // Clean up the created task
    const deleteRequest = new Request(
      `http://localhost:3001/api/tasks/${createdTaskId}`,
      {
        method: "DELETE",
      },
    );
    await DELETE(deleteRequest, { params: { id: createdTaskId.toString() } });
  });

  it("GET /api/tasks should return all tasks", async () => {
    const response = await GETAll();
    const responseBody = await response.json();

    expect(response.status).toBe(200);
    expect(responseBody.success).toBe(true);
    expect(Array.isArray(responseBody.data)).toBe(true);
    expect(responseBody.data.length).toBeGreaterThan(0);
  });

  it("POST /api/tasks should create a new task", async () => {
    const newTask = createValidTask();
    const request = new Request("http://localhost:3001/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTask),
    });

    const response = await POST(request);
    const responseBody = await response.json();

    expect(response.status).toBe(201);
    expect(responseBody.success).toBe(true);
    expect(responseBody.data).toMatchObject(newTask);
    expect(responseBody.data).toHaveProperty("id");
  });

  it("POST /api/tasks should handle invalid task data", async () => {
    const invalidTask = { title: "Incomplete Task" };
    const request = new Request("http://localhost:3001/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(invalidTask),
    });

    const response = await POST(request);
    const responseBody = await response.json();

    expect(response.status).toBe(400);
    expect(responseBody.success).toBe(false);
    expect(responseBody.errors).toBeDefined();
  });

  it("GET /api/tasks/:id should return a task by ID", async () => {
    const request = new Request(
      `http://localhost:3001/api/tasks/${createdTaskId}`,
      {
        method: "GET",
      },
    );
    const response = await GET(request, {
      params: { id: createdTaskId.toString() },
    });
    const responseBody = await response.json();

    expect(response.status).toBe(200);
    expect(responseBody.success).toBe(true);
    expect(responseBody.data.id).toBe(createdTaskId);
  });

  it("PUT /api/tasks/:id should update an existing task", async () => {
    const updatedTaskData = {
      id: createdTaskId,
      status: "inProgress",
      priority: "high",
    };

    const request = new Request(
      `http://localhost:3001/api/tasks/${createdTaskId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTaskData),
      },
    );

    const response = await PUT(request, {
      params: { id: createdTaskId.toString() },
    });
    const responseBody = await response.json();

    expect(response.status).toBe(200);
    expect(responseBody.success).toBe(true);
    expect(responseBody.data.status).toBe("inProgress");
    expect(responseBody.data.priority).toBe("high");
  });

  it("PUT /api/tasks/:id should handle invalid data (invalid status)", async () => {
    const invalidTaskData = {
      status: "finished",
      priority: "high",
    };

    const request = new Request(
      `http://localhost:3001/api/tasks/${createdTaskId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invalidTaskData),
      },
    );

    const response = await PUT(request, {
      params: { id: createdTaskId.toString() },
    });
    const responseBody = await response.json();

    expect(response.status).toBe(400);
    expect(responseBody.success).toBe(false);
    expect(responseBody.message).toContain("Invalid request body");
    expect(responseBody.errors).toBeDefined();
    expect(responseBody.errors.status).toBeDefined();
  });

  it("PUT /api/tasks/:id should add a comment to a task", async () => {
    const newComment = "This is a new comment.";

    const request = new Request(
      `http://localhost:3001/api/tasks/${createdTaskId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comments: [newComment] }),
      },
    );

    const response = await PUT(request, {
      params: { id: createdTaskId.toString() },
    });
    const responseBody = await response.json();

    expect(response.status).toBe(200);
    expect(responseBody.success).toBe(true);
    expect(responseBody.data.comments).toContain(newComment);
  });

  it("DELETE /api/tasks/:id should delete an existing task", async () => {
    const deleteRequest = new Request(
      `http://localhost:3001/api/tasks/${createdTaskId}`,
      {
        method: "DELETE",
      },
    );

    const response = await DELETE(deleteRequest, {
      params: { id: createdTaskId.toString() },
    });
    const responseBody = await response.json();

    expect(response.status).toBe(200); // Check for successful deletion
    expect(responseBody.success).toBe(true);
    expect(responseBody.message).toBe("Task deleted successfully");
  });

  it("DELETE /api/tasks/:id should handle non-existent task", async () => {
    const deleteRequest = new Request(
      `http://localhost:3001/api/tasks/${createdTaskId}`,
      {
        method: "DELETE",
      },
    );

    const response = await DELETE(deleteRequest, {
      params: { id: createdTaskId.toString() },
    });
    const responseBody = await response.json();

    expect(response.status).toBe(404); // Expect a 404 for non-existent task
    expect(responseBody.success).toBe(false);
    expect(responseBody.message).toBe("Task not found");
  });
});
