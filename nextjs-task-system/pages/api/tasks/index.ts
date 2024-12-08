import { verifyToken } from "@/database/auth";
import { db } from "@/database/task";
import { Task, User } from "@/types";
import { protectRoute } from "@/utils/middleware";
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      return protectRoute(getTasks)(req, res);
    case "POST":
      return protectRoute(createTask, "admin")(req, res);
    case "PUT":
      return protectRoute(updateTask, "admin")(req, res);
    case "DELETE":
      return protectRoute(deleteTask, "admin")(req, res);
    case "PATCH":
      return protectRoute(updateTaskStatus)(req, res);
    default:
      return res.status(405).json({ message: "Method Not Allowed" });
  }
}

// Función para obtener todas las tareas
const getTasks = (req: NextApiRequest, res: NextApiResponse) => {
  // Obtener el token del encabezado Authorization
  const token = req.headers["authorization"]?.split(" ")[1]; // El formato es "Bearer <token>"
  const userId = req.userId;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  // Verificar y decodificar el token
  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }

  // Consultar el rol del usuario en la base de datos
  db.get("SELECT role FROM users WHERE id = ?", [userId], (err, row: User) => {
    if (err) {
      console.error("Error retrieving user role:", err.message);
      return res
        .status(500)
        .json({ message: "Error retrieving user role", error: err.message });
    }

    if (!row) {
      return res.status(404).json({ message: "User not found" });
    }

    const userRole = row.role;

    // Si el usuario es admin, obtener todas las tareas
    if (userRole === "admin") {
      db.all("SELECT * FROM tasks", (err, rows: Task[]) => {
        if (err) {
          console.error("Error retrieving tasks:", err.message);
          return res
            .status(500)
            .json({ message: "Error retrieving tasks", error: err.message });
        }

        // Procesar el campo assigned_to
        const tasks = rows.map((task: Task) => {
          if (typeof task.assigned_to === "string") {
            try {
              // Intenta parsear la cadena como un objeto JSON
              task.assigned_to = JSON.parse(task.assigned_to);
            } catch (e) {
              // Si no es un objeto JSON válido, convertimos a número
              task.assigned_to = parseInt(JSON.stringify(task.assigned_to), 10);
            }
          }
          return task;
        });

        return res.status(200).json(tasks);
      });
    } else if (userRole === "regular") {
      // Si el usuario es regular, obtener solo las tareas asignadas a él
      db.all(
        "SELECT * FROM tasks WHERE assigned_to = ?",
        [userId],
        (err, rows: Task[]) => {
          if (err) {
            console.error("Error retrieving user tasks:", err.message);
            return res.status(500).json({
              message: "Error retrieving user tasks",
              error: err.message,
            });
          }

          // Procesar el campo assigned_to
          const tasks = rows.map((task: Task) => {
            if (typeof task.assigned_to === "string") {
              try {
                // Intenta parsear la cadena como un objeto JSON
                task.assigned_to = JSON.parse(task.assigned_to);
              } catch (e) {
                // Si no es un objeto JSON válido, convertimos a número
                task.assigned_to = parseInt(
                  JSON.stringify(task.assigned_to),
                  10,
                );
              }
            }
            return task;
          });

          return res.status(200).json(tasks);
        },
      );
    } else {
      return res.status(403).json({ message: "Forbidden: Invalid user role" });
    }
  });
};

// Función para crear una tarea
const createTask = (req: NextApiRequest, res: NextApiResponse) => {
  const {
    title,
    description,
    assigned_to,
    due_date,
    priority,
    status,
    comments,
  } = req.body;

  // Validación básica de los datos
  if (!title || !assigned_to || !due_date || !priority) {
    return res.status(400).json({ message: "Faltan campos requeridos" });
  }

  // Serializar assigned_to si es un objeto
  let assignedToValue: string;

  if (typeof assigned_to === "number") {
    assignedToValue = assigned_to.toString(); // Si es un número, lo guardamos como cadena
  } else if (typeof assigned_to === "object") {
    assignedToValue = JSON.stringify(assigned_to); // Si es un objeto, lo serializamos
  } else {
    return res
      .status(400)
      .json({ message: "Formato de assigned_to no válido" });
  }

  // Crear la consulta SQL para insertar la tarea
  const query = `
    INSERT INTO tasks (title, description, assigned_to, due_date, priority, status, comments)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  // Ejecutar la consulta
  db.run(
    query,
    [
      title,
      description,
      assignedToValue, // Almacenamos el valor serializado de assigned_to
      due_date,
      priority,
      status || "Pendiente",
      comments || "",
    ],
    function (err) {
      if (err) {
        console.error("Error al crear tarea:", err.message);
        return res.status(500).json({ message: "Error al crear tarea" });
      }

      return res
        .status(201)
        .json({ message: "Tarea creada con éxito", taskId: this.lastID });
    },
  );
};

const updateTask = (req: NextApiRequest, res: NextApiResponse) => {
  const { id, assigned_to, title, description, due_date, priority, comments } =
    req.body;

  if (!id) {
    return res.status(400).json({ error: "Task ID is required" });
  }

  // Verificar si solo se está asignando un usuario
  if (
    assigned_to &&
    !title &&
    !description &&
    !due_date &&
    !priority &&
    !comments
  ) {
    // Proceso para asignar usuario
    db.get("SELECT id FROM users WHERE id = ?", [assigned_to], (err, user) => {
      if (err) {
        return res.status(500).json({ error: "Error verifying user" });
      }

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      db.run(
        "UPDATE tasks SET assigned_to = ? WHERE id = ?",
        [assigned_to, id],
        function (err) {
          if (err) {
            return res
              .status(500)
              .json({ error: "Error updating task " + err });
          }

          if (this.changes === 0) {
            return res.status(404).json({ error: "Task not found" });
          }

          return res
            .status(200)
            .json({ message: "Task assigned successfully" });
        },
      );
    });
  } else {
    // Proceso para edición de tarea completa
    const fields = [];
    const values = [];

    if (title) {
      fields.push("title = ?");
      values.push(title);
    }
    if (description) {
      fields.push("description = ?");
      values.push(description);
    }
    if (due_date) {
      fields.push("due_date = ?");
      values.push(due_date);
    }
    if (priority) {
      fields.push("priority = ?");
      values.push(priority);
    }
    if (comments) {
      fields.push("comments = ?");
      values.push(comments);
    }

    values.push(id);

    const query = `UPDATE tasks SET ${fields.join(", ")} WHERE id = ?`;

    db.run(query, values, function (err) {
      if (err) {
        return res.status(500).json({ error: "Error updating task " + err });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: "Task not found" });
      }

      return res.status(200).json({ message: "Task updated successfully" });
    });
  }
};

const deleteTask = (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: "Task ID is required" });
  }

  // Verificar si la tarea existe antes de eliminarla
  db.get("SELECT id FROM tasks WHERE id = ?", [id], (err, task) => {
    if (err) {
      return res.status(500).json({ error: "Error verifying task" });
    }

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    // Eliminar la tarea
    db.run("DELETE FROM tasks WHERE id = ?", [id], function (err) {
      if (err) {
        return res.status(500).json({ error: "Error deleting task " + err });
      }

      if (this.changes === 0) {
        return res
          .status(404)
          .json({ error: "Task not found or already deleted" });
      }

      return res.status(200).json({ message: "Task deleted successfully" });
    });
  });
};

const updateTaskStatus = (req: NextApiRequest, res: NextApiResponse) => {
  const userId = req.userId; // ID del usuario autenticado
  const { id, status } = req.body; // ID de la tarea y el nuevo estado

  if (!id || !status) {
    return res.status(400).json({ error: "Task ID and status are required" });
  }

  // Verificar si la tarea está asignada al usuario o a su grupo
  db.get(
    "SELECT assigned_to FROM tasks WHERE id = ?",
    [id],
    (err, task: Task) => {
      if (err) {
        return res.status(500).json({ error: "Error fetching task" });
      }

      if (!task || task.assigned_to !== userId) {
        return res
          .status(403)
          .json({ error: "Forbidden: Task not assigned to user" });
      }

      // Actualizar el estado de la tarea
      db.run(
        "UPDATE tasks SET status = ? WHERE id = ?",
        [status, id],
        function (err) {
          if (err) {
            return res
              .status(500)
              .json({ error: "Error updating task status" });
          }

          if (this.changes === 0) {
            return res.status(404).json({ error: "Task not found" });
          }

          return res.status(200).json({
            message: "Task status updated successfully",
            taskId: id,
            newStatus: status,
          });
        },
      );
    },
  );
};
