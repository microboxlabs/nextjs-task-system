import { GET, PUT, DELETE } from "@/app/api/tasks/[id]/route";

describe("API: /api/tasks", () => {
  it("GET /api/tasks/:id should return a task by ID", async () => {
    const id = "1";
    const response = await GET({ params: { id: id } }); // Get task by ID
    const responseBody = await response.json();

    expect(response.status).toBe(200); // Expect a 200 OK status
    expect(responseBody.success).toBe(true); // Expect success to be true
    expect(String(responseBody.data.id)).toBe(id); // Expect the returned task's ID to match
  });

  it("PUT /api/tasks should update an existing task", async () => {
    const id = "6";
    const getResponse = await GET({ params: { id: id } });
    const tasksResponse = await getResponse.json();
    const validTask = tasksResponse.data; // Fix this to access the task data

    expect(validTask).toBeDefined(); // Ensure the task exists

    const updatedTaskData = {
      id: validTask.id, // Use validTask.id here
      status: "inProgress",
      priority: "high",
    };

    const request = new Request(`http://localhost:3001/api/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedTaskData),
    });

    const response = await PUT(request, { params: { id: id } });
    const responseBody = await response.json();

    expect(response.status).toBe(200); // Expect a 200 OK status
    expect(responseBody.success).toBe(true); // Expect success to be true
    expect(responseBody.data.status).toBe("inProgress"); // Expect the status to be updated
    expect(responseBody.data.priority).toBe("high"); // Expect the priority to be updated
  });

  it("PUT /api/tasks should handle invalid data (invalid status)", async () => {
    const id = "6";
    const invalidTaskData = {
      status: "finished", // Invalid status (this will trigger the enum error)
      priority: "high",
    };

    const request = new Request(`http://localhost:3001/api/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(invalidTaskData),
    });

    const response = await PUT(request, { params: { id: id } });
    const responseBody = await response.json();
    console.log(JSON.stringify(responseBody));

    expect(response.status).toBe(400); // Expect a 400 Bad Request status
    expect(responseBody.success).toBe(false); // Expect failure due to invalid data
    expect(responseBody.message).toContain("Validation error"); // Check that the error message contains 'Validation error'
    expect(responseBody.errors).toBeDefined(); // Verify that errors are defined
    // Check that the error is in the 'status' field and contains the correct message
    expect(responseBody.errors.status).toContain(
      "Invalid enum value. Expected 'pending' | 'inProgress' | 'completed', received 'finished'",
    );
  });

  it("DELETE /api/tasks should delete an existing task", async () => {
    const id = "6";
    const deleteRequest = new Request(`http://localhost:3001/api/tasks/${id}`, {
      method: "DELETE",
    });

    const response = await DELETE({
      params: { id: id },
    });
    const responseBody = await response.json();

    expect(response.status).toBe(200); // Expect a 200 OK status
    expect(responseBody.success).toBe(true); // Expect success to be true
    expect(responseBody.message).toBe("Task deleted successfully"); // Expect a success message
  });

  it("DELETE /api/tasks should handle non-existent task", async () => {
    const id = "9999"; // Non-existent task ID
    const deleteRequest = new Request(`http://localhost:3001/api/tasks/${id}`, {
      method: "DELETE",
    });

    const response = await DELETE({ params: { id: id } });
    const responseBody = await response.json();

    expect(response.status).toBe(404); // Expect a 404 Not Found status
    expect(responseBody.success).toBe(false); // Expect failure due to non-existent task
    expect(responseBody.error).toBe("Task not found"); // Expect a message indicating the task does not exist
  });
});
