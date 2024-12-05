let globalToken: string,taskId: string;
const usernameRandom = randomString(10);

describe("Register, Login, and Token Setup", () => {
  it("Registrar a admin", async () => {
      const registerResponse = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: usernameRandom,
          password: "password123",
          role: "admin",
        }),
      });
      expect(registerResponse.status).toBe(201);
  });

  it("Iniciar sesión con el usuario registrado", async () => {
    const username = usernameRandom;
    const password = "password123";
  
    const credentials = btoa(`${username}:${password}`);
  
    const loginResponse = await fetch("http://localhost:3000/api/auth/login", {
      method: "GET",  
      headers: {
        "Accept": "application/vnd.api+json",
        "Authorization": `Basic ${credentials}`
      },
    });
  
    expect(loginResponse.status).toBe(200);
    const loginData = await loginResponse.json();
  
    
    expect(loginData).toHaveProperty("token");
    // Guardar el token globalmente para usar en otros tests
    globalToken = loginData.token;
  });
  
});


describe("Crud de task", () => {
  it("Crear una tarea", async () => {
    const createTaskResponse = await fetch("http://localhost:3000/api/task", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${globalToken}`,
      },
      body: JSON.stringify({
        title: "Nueva tarea",
        description: "Descripción de la tarea",
        assignedTo: [],
        dueDate: "2024-12-10T00:00:00Z",
        priority: "low",
        status: "pending",
      }),
    });
    expect(createTaskResponse.status).toBe(201);
    const taskData = await createTaskResponse.json();
    expect(taskData).toHaveProperty("message", "Tarea creada exitosamente");
    taskId = taskData.task.id.toString()
  });

  it("Obtener todas las tareas", async () => {
    const getTasksResponse = await fetch("http://localhost:3000/api/task?page=1&limit10", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${globalToken}`,
      },
    });
    expect(getTasksResponse.status).toBe(200);
    const tasksData = await getTasksResponse.json();
    expect(Array.isArray(tasksData.data)).toBe(true);
  });


  it("Actualizar una tarea", async () => {
    const updateTaskResponse = await fetch("http://localhost:3000/api/task", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${globalToken}`,
      },
      body: JSON.stringify({
        id: taskId,
        title: "Tarea actualizada",
        description: "Descripción de tarea actualizada",
        assignedTo: [],
        priority: "low",
        status: "inProgress",
        dueDate: "2024-12-20T00:00:00Z",
      }),
    });
    expect(updateTaskResponse.status).toBe(200);
    const updatedTask = await updateTaskResponse.json();
    expect(updatedTask).toHaveProperty("message", "Tarea actualizada");
  });

  it("Eliminar una tarea", async () => {
    const deleteTaskResponse = await fetch(`http://localhost:3000/api/task?id=${taskId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${globalToken}`,
      },
    });
    expect(deleteTaskResponse.status).toBe(200);
  });
  
});


function randomString(length:number) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}