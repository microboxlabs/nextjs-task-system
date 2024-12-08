import { verifyToken } from "@/database/auth";
import { db } from "@/database/task";
import { Group, Task, User } from "@/types";
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
      return protectRoute(updateTaskStatusAndComment)(req, res);
    default:
      return res.status(405).json({ message: "Method Not Allowed" });
  }
}

// Función para obtener todas las tareas
const getTasks = (req: NextApiRequest, res: NextApiResponse) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // El formato es "Bearer <token>"
  const userId = req.userId;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }

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

    if (userRole === "admin") {
      // Admin: obtener todas las tareas
      db.all("SELECT * FROM tasks", async (err, rows: Task[]) => {
        if (err) {
          console.error("Error retrieving tasks:", err.message);
          return res
            .status(500)
            .json({ message: "Error retrieving tasks", error: err.message });
        }

        const tasks = await Promise.all(rows.map(processTaskWithAssignedName));
        return res.status(200).json(tasks);
      });
    } else if (userRole === "regular") {
      // Regular: obtener tareas asignadas al usuario o a sus grupos
      db.all(
        "SELECT group_id FROM user_groups WHERE user_id = ?",
        [userId],
        (err, groupRows: { group_id: number }[]) => {
          if (err) {
            console.error("Error retrieving user groups:", err.message);
            return res.status(500).json({
              message: "Error retrieving user groups",
              error: err.message,
            });
          }

          const groupIds = groupRows.map((row) => row.group_id);

          db.all("SELECT * FROM tasks", async (err, rows: Task[]) => {
            if (err) {
              console.error("Error retrieving tasks:", err.message);
              return res.status(500).json({
                message: "Error retrieving tasks",
                error: err.message,
              });
            }

            const tasks = await Promise.all(
              rows
                .map(processAssignedTo)
                .filter((task) => {
                  if (typeof task.assigned_to === "number") {
                    // Tareas asignadas directamente al usuario
                    return task.assigned_to === userId;
                  } else if (
                    typeof task.assigned_to === "object" &&
                    task.assigned_to.type === "group"
                  ) {
                    // Tareas asignadas a un grupo al que pertenece el usuario
                    return groupIds.includes(task.assigned_to.id);
                  }
                  return false;
                })
                .map(processTaskWithAssignedName),
            );

            return res.status(200).json(tasks);
          });
        },
      );
    } else {
      return res.status(403).json({ message: "Forbidden: Invalid user role" });
    }
  });
};

// Procesar el campo assigned_to para convertirlo
const processAssignedTo = (task: Task): Task => {
  if (typeof task.assigned_to === "string") {
    try {
      task.assigned_to = JSON.parse(task.assigned_to);
    } catch (e) {
      task.assigned_to = parseInt(JSON.stringify(task.assigned_to), 10);
    }
  }
  return task;
};

// Agregar el campo assigned_name a la tarea
const processTaskWithAssignedName = async (task: Task): Promise<Task> => {
  const processedTask = processAssignedTo(task);
  if (typeof processedTask.assigned_to === "number") {
    // Consultar el nombre del usuario
    return new Promise((resolve) => {
      db.get(
        "SELECT username FROM users WHERE id = ?",
        [processedTask.assigned_to],
        (err, row: { username: string }) => {
          if (err) {
            console.error("Error retrieving username:", err.message);
            processedTask["assigned_name"] = null;
          } else {
            processedTask["assigned_name"] = row ? row.username : null;
          }
          resolve(processedTask);
        },
      );
    });
  } else if (typeof processedTask.assigned_to === "object") {
    // Consultar el nombre del grupo
    return new Promise((resolve) => {
      if (typeof processedTask.assigned_to === "object") {
        db.get(
          "SELECT name FROM groups WHERE id = ?",
          [processedTask.assigned_to.id],
          (err, row: { name: string }) => {
            if (err) {
              console.error("Error retrieving group name:", err.message);
              processedTask["assigned_name"] = null;
            } else {
              processedTask["assigned_name"] = row ? row.name : null;
            }
            resolve(processedTask);
          },
        );
      } else {
        // Si no es un grupo, resolver con la tarea sin modificar
        resolve(processedTask);
      }
    });
  }
  return processedTask;
};

// Función para crear una tarea
const createTask = (req: NextApiRequest, res: NextApiResponse) => {
  const {
    title,
    description,
    assigned_to,
    due_date,
    created_date,
    priority,
    status,
    comments,
  } = req.body;

  // Validación básica de los datos
  if (!title || !assigned_to || !due_date || !created_date || !priority) {
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
    INSERT INTO tasks (title, description, assigned_to, due_date, created_date, priority, status, comments)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  // Ejecutar la consulta
  db.run(
    query,
    [
      title,
      description,
      assignedToValue, // Almacenamos el valor serializado de assigned_to
      due_date,
      created_date,
      priority,
      status || "Pendiente",
      comments || "",
    ],
    function (err) {
      if (err) {
        console.error("Error al crear tarea:", err.message);
        return res.status(500).json({ message: "Error al crear tarea" });
      }

      const taskId = this.lastID;

      // Resolver el campo assigned_name
      resolveAssignedName(assigned_to)
        .then((assigned_name) => {
          return res.status(201).json({
            message: "Tarea creada con éxito",
            taskId,
            assigned_name,
          });
        })
        .catch((error) => {
          console.error("Error al resolver assigned_name:", error.message);
          return res.status(500).json({
            message: "Error al obtener el nombre asignado",
            taskId,
          });
        });
    },
  );
};

// Resolver el campo assigned_name
const resolveAssignedName = (
  assigned_to: number | { type: string; id: number },
): Promise<string | null> => {
  return new Promise((resolve, reject) => {
    if (typeof assigned_to === "number") {
      // Consultar el nombre del usuario
      db.get(
        "SELECT username FROM users WHERE id = ?",
        [assigned_to],
        (err, row: { username: string }) => {
          if (err) {
            return reject(err);
          }
          resolve(row ? row.username : null);
        },
      );
    } else if (typeof assigned_to === "object") {
      // Consultar el nombre del grupo
      db.get(
        "SELECT name FROM groups WHERE id = ?",
        [assigned_to.id],
        (err, row: { name: string }) => {
          if (err) {
            return reject(err);
          }
          resolve(row ? row.name : null);
        },
      );
    } else {
      resolve(null);
    }
  });
};

const updateTask = (req: NextApiRequest, res: NextApiResponse) => {
  const {
    id,
    assigned_to,
    title,
    description,
    due_date,
    created_date,
    priority,
    comments,
  } = req.body;

  if (!id) {
    return res.status(400).json({ error: "Task ID is required" });
  }

  // Verificar si solo se está asignando un usuario
  if (
    assigned_to &&
    !title &&
    !description &&
    !due_date &&
    !created_date &&
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
    if (created_date) {
      fields.push("create_date = ?");
      values.push(created_date);
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

// Función para actualizar el campo status y comments de una tarea
const updateTaskStatusAndComment = (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  const { taskId, status, comments } = req.body;

  // Validar entrada
  if (!taskId) {
    return res.status(400).json({ message: "Faltan campos requeridos" });
  }

  // Consultar si la tarea existe
  db.get("SELECT * FROM tasks WHERE id = ?", [taskId], (err, task: Task) => {
    if (err) {
      console.error("Error al buscar tarea:", err.message);
      return res.status(500).json({ message: "Error al buscar tarea" });
    }

    if (!task) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }

    // Preparar las actualizaciones
    let updateFields: string[] = [];
    let updateValues: (string | null)[] = [];

    if (status) {
      updateFields.push("status = ?");
      updateValues.push(status);
    }

    if (comments !== undefined) {
      // Comprobamos que no sea undefined
      updateFields.push("comments = ?");
      updateValues.push(comments);
    }

    if (updateFields.length === 0) {
      return res
        .status(400)
        .json({ message: "No se enviaron campos para actualizar" });
    }

    // Añadir el taskId al final de los valores
    updateValues.push(taskId);

    // Crear consulta dinámica para actualizar los campos
    const updateQuery = `UPDATE tasks SET ${updateFields.join(", ")} WHERE id = ?`;

    // Ejecutar la consulta de actualización
    db.run(updateQuery, updateValues, function (err) {
      if (err) {
        console.error("Error al actualizar tarea:", err.message);
        return res.status(500).json({
          message: "Error al actualizar el estado o comentario de la tarea",
        });
      }

      // Obtener assigned_name si es necesario
      resolveAssignedName(task.assigned_to)
        .then((assigned_name) => {
          return res.status(200).json({
            message: "Tarea actualizada con éxito",
            task: {
              ...task,
              status: status || task.status, // Mantener el valor original si no se ha actualizado
              comments: comments !== undefined ? comments : task.comments, // Mantener el valor original si no se ha actualizado
              assigned_name,
            },
          });
        })
        .catch((error) => {
          console.error("Error al resolver assigned_name:", error.message);
          return res.status(500).json({
            message:
              "Tarea actualizada, pero error al obtener el nombre asignado",
            taskId,
          });
        });
    });
  });
};
