import { GET, PUT, DELETE } from "@/app/api/tasks/[id]/route";

describe("API: /api/tasks", () => {
  it("GET /api/tasks/:id should return a task by ID", async () => {
    const id = "1";
    const response = await GET({ params: { id: id } });
    const responseBody = await response.json();

    expect(response.status).toBe(200); // Check for successful status
    expect(responseBody.success).toBe(true); // Expect success to be true
    expect(String(responseBody.data.id)).toBe(id); // Task ID should match
  });

  it("PUT /api/tasks/:id should update an existing task", async () => {
    const id = "6";
    const getResponse = await GET({ params: { id: id } });
    const tasksResponse = await getResponse.json();
    const validTask = tasksResponse.data;

    expect(validTask).toBeDefined(); // Ensure task exists

    const updatedTaskData = {
      id: validTask.id,
      status: "inProgress",
      priority: "high",
    };

    const request = new Request(`http://localhost:3001/api/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedTaskData),
    });

    const response = await PUT(request, { params: { id: id } });
    const responseBody = await response.json();

    expect(response.status).toBe(200); // Check for success
    expect(responseBody.success).toBe(true);
    expect(responseBody.data.status).toBe("inProgress");
    expect(responseBody.data.priority).toBe("high");
  });

  it("PUT /api/tasks/:id should handle invalid data (invalid status)", async () => {
    const id = "6";
    const invalidTaskData = {
      status: "finished",
      priority: "high",
    };

    const request = new Request(`http://localhost:3001/api/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(invalidTaskData),
    });

    const response = await PUT(request, { params: { id: id } });
    const responseBody = await response.json();

    expect(response.status).toBe(400); // Expect a 400 due to invalid data
    expect(responseBody.success).toBe(false);
    expect(responseBody.message).toContain("Invalid request body");
    expect(responseBody.errors).toBeDefined();
    expect(responseBody.errors.status).toContain(
      "Invalid enum value. Expected 'pending' | 'inProgress' | 'completed', received 'finished'",
    );
  });

  it("DELETE /api/tasks/:id should delete an existing task", async () => {
    const id = "6";
    const deleteRequest = new Request(`http://localhost:3001/api/tasks/${id}`, {
      method: "DELETE",
    });

    const response = await DELETE(deleteRequest, { params: { id: id } });
    const responseBody = await response.json();

    expect(response.status).toBe(200); // Check for successful deletion
    expect(responseBody.success).toBe(true);
    expect(responseBody.message).toBe("Task deleted successfully");
  });

  it("DELETE /api/tasks/:id should handle non-existent task", async () => {
    const id = "9999";
    const deleteRequest = new Request(`http://localhost:3001/api/tasks/${id}`, {
      method: "DELETE",
    });

    const response = await DELETE(deleteRequest, { params: { id: id } });
    const responseBody = await response.json();

    expect(response.status).toBe(404); // Expect a 404 for non-existent task
    expect(responseBody.success).toBe(false);
    expect(responseBody.message).toBe("Task not found");
  });
});
