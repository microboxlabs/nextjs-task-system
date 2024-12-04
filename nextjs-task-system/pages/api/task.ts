import prisma from "@/libs/prisma";
import { validateToken } from "../../middleware/auth";
import { Priority, Role, Status } from "@prisma/client";
import { expressValidator, validator } from "@/libs/express-validator";

const task = async (req, res) => {
  if (req.method === "GET" && ["admin"].includes(req.user.role)) {
    await expressValidator(req, res, validator.getAllTasks);
    const { page, limit, id, assignedTo, priority, status, order } = req.query;

    const where = {
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
      const data = await prisma.task.findMany({
        skip: (page - 1) * limit,
        take: parseInt(limit),
        include: {
          assignedTo: true,
          comments: { include: { user: true } },
        },
        where,
        orderBy: {
          ...(order == "oldestCreated" ? {createdAt: "asc"} : null),
          ...(order == "mostRecentCreated" ? {createdAt: "desc"} : null),
          ...(order == "oldestExpirationDate" ? { dueDate: "asc"} : null),
          ...(order == "mostRecentExpirationDate" ? {dueDate: "desc"} : null),
          ...(order == "byPriority" ? {priority : "asc"} : null),
        }
      });
      const totalItems = await prisma.task.count({
        where,
      });
      return res.status(200).json({
        data,
        totalItems: data.length,
        totalPages: Math.ceil(totalItems / limit),
      });
    } catch (error) {
      console.log({error})
      return res.status(500).json({ error: "Error al obtener los tasks" });
    }
  }

  if (req.method === "GET" && ["admin"].includes(req.user.role)) {
    await expressValidator(req, res, validator.getAllTasks);
    const { page, limit, id, priority, status } = req.query;

    const where = {
      assignedTo: {
        some: {
          username: req.user.username,
        },
      },
      ...(id ? { id: parseInt(id) } : null),
      ...(priority ? { priority } : null),
      ...(status ? { status } : null),
    };

    try {
      const data = await prisma.task.findMany({
        skip: (page - 1) * limit,
        take: parseInt(limit),
        include: {
          assignedTo: true,
          comments: { include: { user: true } },
        },
        where,
      });
      const totalItems = await prisma.task.count({
        where,
      });
      return res.status(200).json({
        data,
        totalItems: data.length,
        totalPages: Math.ceil(totalItems / limit),
      });
    } catch (error) {
      return res.status(500).json({ error: "Error al obtener los tasks" });
    }
  }

  if (req.method === "POST" && ["admin"].includes(req.user.role)) {
    try {
      await expressValidator(req, res, validator.createTask);
      const {
        title,
        description,
        assignedTo,
        dueDate,
        priority = Priority.low,
        status = Status.pending,
      } = req.body;
      const task = await prisma.task.create({
        data: {
          title,
          description,
          dueDate: new Date(dueDate),
          priority,
          status,
          assignedTo: {
            connect: assignedTo.map((id: string) => {
              return { id: parseInt(id) };
            }),
          },
        },
      });

      return res
        .status(201)
        .json({ message: "task creado exitosamente", task });
    } catch (error) {
      return res.status(500).json({ error: "Error al crear el task" });
    }
  }

  if (req.method === "PUT" && ["admin"].includes(req.user.role)) {
    let task;
    try {
      const {
        id,
        title,
        description,
        assignedTo,
        dueDate,
        message,
        priority = Priority.low,
        status = Status.pending,
      } = req.body;
      if (message) {
        task = await prisma.task.update({
          where: { id : parseInt(id) },
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
          where: { id : parseInt(id) },
          data: {
            title,
            description,
            dueDate: new Date(dueDate),
            priority,
            status,
            assignedTo: {
              connect: assignedTo.map((id: string) => {
                return { id: parseInt(id) };
              }),
            },
          },
        });
      }

      return res.status(200).json({ message: "task actualizado", task });
    } catch (error) {
      console.log({ error });
      return res.status(500).json({ error: "Error al actualizar el task" });
    }
  }

  if (req.method === "PUT" && ["regular"].includes(req.user.role)) {
    const { id, status = Status.pending, message } = req.body;
    try {
      let task;
      if (message) {
        task = await prisma.task.update({
          where: {
            id : parseInt(id),
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
            id : parseInt(id),
            assignedTo: {
              some: {
                username: req.user.username,
              },
            },
          },
          data: { status },
        });
      }
      return res.status(200).json({ message: "task actualizado", task });
    } catch (error) {
      return res.status(500).json({ error: "Error al actualizar el task" });
    }
  }

  if (req.method === "DELETE" && ["admin"].includes(req.user.role)) {
    const { id } = req.query;
    try {
      await prisma.task.delete({ where: { id: parseInt(id) } });
      return res.status(200).json({ message: "task eliminado" });
    } catch (error) {
      console.log({error})
      return res.status(500).json({ error: "Error al eliminar el task" });
    }
  }

  return res.status(405).json({ error: "Método no permitido" });
};

export default validateToken(task);
