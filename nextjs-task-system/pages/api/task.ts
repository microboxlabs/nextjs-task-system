import { Response } from "express";
import prisma from "@/libs/prisma";
import { validateToken } from "../../middleware/auth";
import { Priority, Status, Task, User } from "@prisma/client";
import { expressValidator, validator } from "@/libs/express-validator";
interface GetTasksQuery {
  page: string;
  limit: string;
  id?: string;
  assignedTo?: string;
  priority?: Priority;
  status?: Status;
  order?: "oldestCreated" | "mostRecentCreated" | "oldestExpirationDate" | "mostRecentExpirationDate" | "byPriority";
}

interface CreateOrUpdateTaskBody {
  id: string,
  title: string;
  description: string;
  assignedTo: string[]; 
  dueDate: string; 
  priority?: Priority;
  status?: Status;
  message?: string;
}

interface TaskWithAssignedToAndComments extends Task {
  assignedTo: User[];
  comments: {
    user: User;
  }[];
}

const task = async (req: any, res: Response): Promise<Response> => {
  // Validación y manejo de la solicitud GET para obtener tareas
  if (req.method === "GET" && ["admin"].includes(req.user.role)) {
    await expressValidator(req, res, validator.getAllTasks);

    const { page="1", limit="10", id, assignedTo, priority, status, order } = req.query as GetTasksQuery;

    const where: any = {
      ...(id ? { id: parseInt(id) } : null),
      ...(assignedTo
        ? {
            assignedTo: {
              some: {
                username: assignedTo,
              },
            },
          }
        : null),
      ...(priority ? { priority } : null),
      ...(status ? { status } : null),
    };

    try {
      const data: TaskWithAssignedToAndComments[] = await prisma.task.findMany({
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
        include: {
          assignedTo: true,
          comments: { include: { user: true } },
        },
        where,
        orderBy: {
          ...(order === "oldestCreated" ? { createdAt: "asc" } : null),
          ...(order === "mostRecentCreated" ? { createdAt: "desc" } : null),
          ...(order === "oldestExpirationDate" ? { dueDate: "asc" } : null),
          ...(order === "mostRecentExpirationDate" ? { dueDate: "desc" } : null),
          ...(order === "byPriority" ? { priority: "asc" } : null),
        },
      });
      const totalItems = await prisma.task.count({ where });
      return res.status(200).json({
        data,
        totalItems,
        totalPages: Math.ceil(totalItems / parseInt(limit)),
      });
    } catch (error) {
      return res.status(500).json({ error: "Error al obtener las tareas" });
    }
  }

  // Validación y manejo de la solicitud POST para crear una tarea
  if (req.method === "POST" && ["admin"].includes(req.user.role)) {
    try {
      await expressValidator(req, res, validator.createUpdateTask);
      const {
        title,
        description,
        assignedTo,
        dueDate,
        priority = Priority.low,
        status = Status.pending,
      } = req.body as CreateOrUpdateTaskBody;

      const task = await prisma.task.create({
        data: {
          title,
          description,
          dueDate: new Date(dueDate),
          priority,
          status,
          assignedTo: {
            connect: assignedTo.map((id: string) => ({ id: parseInt(id) })),
          },
        },
      });

      return res.status(201).json({ message: "Tarea creada exitosamente", task });
    } catch (error) {
      return res.status(500).json({ error: "Error al crear la tarea" });
    }
  }

  // Validación y manejo de la solicitud PUT para actualizar una tarea
  if (req.method === "PUT" && ["admin"].includes(req.user.role)) {
    let task: Task;
    try {
      await expressValidator(req, res, validator.taskExist);
      const {
        id,
        title= "",
        description= "",
        assignedTo=[],
        dueDate= Date.now(),
        message,
        priority = Priority.low,
        status = Status.pending,
      } = req.body as CreateOrUpdateTaskBody;

      if (message) {
        task = await prisma.task.update({
          where: { id: parseInt(id) },
          data: {
            status,
            comments: {
              create: {
                message,
                userId: req.user.id,
              },
            },
          },
        });
      } else {
        task = await prisma.task.update({
          where: { id: parseInt(id) },
          data: {
            title,
            description,
            dueDate: new Date(dueDate),
            priority,
            status,
            assignedTo: {
              connect: assignedTo.map((id: string) => ({ id: parseInt(id) })),
            },
          },
        });
      }

      return res.status(200).json({ message: "Tarea actualizada", task });
    } catch (error) {
      return res.status(500).json({ error: "Error al actualizar la tarea" });
    }
  }

  // Validación y manejo de la solicitud PUT para actualizar una tarea por el usuario regular
  if (req.method === "PUT" && ["regular"].includes(req.user.role)) {
    const { id, status = Status.pending, message } = req.body as CreateOrUpdateTaskBody;
    try {
      await expressValidator(req, res, validator.taskExist);
      let task: Task;
      if (message) {
        task = await prisma.task.update({
          where: {
            id: parseInt(id),
            assignedTo: {
              some: {
                username: req.user.username,
              },
            },
          },
          data: {
            status,
            comments: {
              create: {
                message,
                userId: req.user.id,
              },
            },
          },
        });
      } else {
        task = await prisma.task.update({
          where: {
            id: parseInt(id),
            assignedTo: {
              some: {
                username: req.user.username,
              },
            },
          },
          data: { status },
        });
      }
      return res.status(200).json({ message: "Tarea actualizada", task });
    } catch (error) {
      return res.status(500).json({ error: "Error al actualizar la tarea" });
    }
  }

  // Validación y manejo de la solicitud DELETE para eliminar una tarea
  if (req.method === "DELETE" && ["admin"].includes(req.user.role)) {
    const { id } = req.query;
    try {
      await expressValidator(req, res, validator.taskExistQuery);
      await prisma.task.delete({ where: { id: parseInt(id as string) } });
      return res.status(200).json({ message: "Tarea eliminada" });
    } catch (error) {
      console.log({error})
      return res.status(500).json({ error: "Error al eliminar la tarea" });
    }
  }

  return res.status(405).json({ error: "Método no permitido" });
};

export default validateToken(task);
