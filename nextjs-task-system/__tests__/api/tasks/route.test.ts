// __tests__/api/tasks/route.test.ts
import { GET, POST, PUT, DELETE } from "@/app/api/tasks/route";
import { Task } from "@/adapters/tasksAdapter";

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
    const response = await GET();
    const responseBody = await response.json();

    expect(response.status).toBe(200); // Expect a 200 OK status
    expect(responseBody.success).toBe(true); // Expect success to be true
    expect(Array.isArray(responseBody.data)).toBe(true); // Expect data to be an array
    expect(responseBody.data.length).toBeGreaterThan(0); // Expect at least one task
  });

  it("POST /api/tasks should create a new task", async () => {
    const newTask = createValidTask();

    const request = new Request("http://localhost:3000/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTask),
    });

    const response = await POST(request);
    const responseBody = await response.json();

    expect(response.status).toBe(201); // Expect a 201 Created status
    expect(responseBody.success).toBe(true); // Expect success to be true
    expect(responseBody.data).toMatchObject(newTask); // Expect the returned task to match the new task
    expect(responseBody.data).toHaveProperty("id"); // Expect the returned task to have an ID
  });

  it("POST /api/tasks should handle invalid task data", async () => {
    const invalidTask = { title: "Incomplete Task" }; // Missing required fields

    const request = new Request("http://localhost:3000/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(invalidTask), // Send incomplete task
    });

    const response = await POST(request);
    const responseBody = await response.json();

    expect(response.status).toBe(400); // Expect a 400 Bad Request status due to validation errors
    expect(responseBody.success).toBe(false); // Expect success to be false
    expect(responseBody.error).toBeDefined(); // Expect an error message to be present
  });

  it("PUT /api/tasks should update an existing task", async () => {
    const getResponse = await GET();
    const tasksResponse = await getResponse.json();
    const existingTask = tasksResponse.data.find((task: Task) => task.id); // Verifica que se obtiene una tarea válida

    expect(existingTask).toBeDefined(); // Verifica que haya una tarea existente

    const updatedTaskData = {
      id: existingTask.id,
      status: "inProgress",
      priority: "high",
    };

    const request = new Request("http://localhost:3000/api/tasks", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedTaskData),
    });

    const response = await PUT(request);
    const responseBody = await response.json();

    expect(response.status).toBe(200); // Expect a 200 OK status
    expect(responseBody.success).toBe(true); // Expect success to be true
    expect(responseBody.data.status).toBe("inProgress"); // Expect the status to be updated
    expect(responseBody.data.priority).toBe("high"); // Expect the priority to be updated
  });

  it("PUT /api/tasks should handle invalid data (missing ID)", async () => {
    const updatedTaskData = { status: "inProgress" }; // Missing task ID

    const request = new Request("http://localhost:3000/api/tasks", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedTaskData),
    });

    const response = await PUT(request);
    const responseBody = await response.json();

    expect(response.status).toBe(400); // Expect a 400 Bad Request status due to missing ID
    expect(responseBody.success).toBe(false); // Expect success to be false
    expect(responseBody.error).toBeDefined(); // Expect an error message
  });

  it("DELETE /api/tasks should delete an existing task", async () => {
    const getResponse = await GET();
    const tasksResponse = await getResponse.json();
    const taskToDelete = tasksResponse.data[0]; // Get the first existing task

    const request = new Request(
      `http://localhost:3000/api/tasks?id=${taskToDelete.id}`,
      {
        method: "DELETE",
      },
    );

    const response = await DELETE(request);
    const responseBody = await response.json();

    expect(response.status).toBe(200); // Expect a 200 OK status
    expect(responseBody.success).toBe(true); // Expect success to be true

    // Verify that the task no longer exists
    const getResponseAfterDelete = await GET();
    const tasksAfterDelete = await getResponseAfterDelete.json();
    const deletedTask = tasksAfterDelete.data.find(
      (task: Task) => task.id === taskToDelete.id,
    );

    expect(deletedTask).toBeUndefined(); // Expect the deleted task to be undefined
  });

  it("DELETE /api/tasks should handle non-existent task", async () => {
    const request = new Request("http://localhost:3000/api/tasks?id=9999", {
      method: "DELETE",
    });

    const response = await DELETE(request);
    const responseBody = await response.json();

    expect(response.status).toBe(404); // Expect a 404 Bad Request status due to non-existent task
    expect(responseBody.success).toBe(false); // Expect success to be false
    expect(responseBody.error).toBeDefined(); // Expect an error message
  });
});
