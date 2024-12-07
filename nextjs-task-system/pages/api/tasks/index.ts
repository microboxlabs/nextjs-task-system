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

const getTasks = (req: NextApiRequest, res: NextApiResponse) => {
  const userId = req.userId; // Usuario autenticado
  const { userId: filterUserId, groupId, status } = req.query; // Filtros

  // Verificar el rol del usuario
  db.get("SELECT role FROM users WHERE id = ?", [userId], (err, user: User) => {
    if (err) {
      return res.status(500).json({ error: "Error fetching user role" });
    }

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Construir consulta dinámica
    let query = `
      SELECT tasks.*, 
             users.username AS assigned_user, 
             groups.name AS assigned_group
      FROM tasks
      LEFT JOIN users ON tasks.assigned_to = users.id
      LEFT JOIN user_groups ON tasks.assigned_to = user_groups.user_id
      LEFT JOIN groups ON user_groups.group_id = groups.id
    `;
    const conditions: string[] = [];
    const params: (string | number)[] = [];

    if (user.role !== "admin") {
      // Usuarios regulares solo ven sus tareas
      conditions.push("tasks.assigned_to = ?");
      params.push(userId!); // usamos ! para asegurar que userId no es undefined
    } else {
      // Admin puede aplicar filtros adicionales
      if (filterUserId) {
        conditions.push("tasks.assigned_to = ?");
        params.push(Number(filterUserId));
      }
      if (groupId) {
        conditions.push(
          "tasks.assigned_to IN (SELECT user_id FROM user_groups WHERE group_id = ?)",
        );
        params.push(Number(groupId));
      }
    }

    if (status) {
      conditions.push("tasks.status = ?");
      params.push(status as string);
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`;
    }

    db.all(query, params, (err, rows) => {
      if (err) {
        console.error("Error executing query:", err); // Log the error
        return res
          .status(500)
          .json({ error: "Error fetching tasks", details: err.message });
      }
      return res.status(200).json(rows);
    });
  });
};

const createTask = (req: NextApiRequest, res: NextApiResponse) => {
  const { title, description, assigned_to, due_date, priority } = req.body;

  if (assigned_to && assigned_to.type === "group") {
    // Si el assigned_to es un grupo, asignamos la tarea a todos los usuarios del grupo
    db.all(
      "SELECT user_id FROM user_groups WHERE group_id = ?",
      [assigned_to.id],
      (err, users: { user_id: number }[]) => {
        if (err) {
          return res
            .status(500)
            .json({ error: "Error fetching group members" });
        }

        // Insertar la tarea para cada usuario del grupo
        users.forEach((user) => {
          db.run(
            `INSERT INTO tasks (title, description, assigned_to, due_date, priority) VALUES (?, ?, ?, ?, ?)`,
            [title, description, user.user_id, due_date, priority],
            function (err) {
              if (err) {
                return res
                  .status(500)
                  .json({ error: "Error creating task " + err });
              }
            },
          );
        });

        return res
          .status(201)
          .json({ message: "Task created and assigned to group" });
      },
    );
  } else {
    // Si no es un grupo, asignar la tarea a un solo usuario
    db.run(
      `INSERT INTO tasks (title, description, assigned_to, due_date, priority) VALUES (?, ?, ?, ?, ?)`,
      [title, description, assigned_to, due_date, priority],
      function (err) {
        if (err) {
          return res.status(500).json({ error: "Error creating task " + err });
        }
        return res
          .status(201)
          .json({ id: this.lastID, message: "Task created successfully" });
      },
    );
  }
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
