import { validationResult, checkSchema, ValidationChain } from "express-validator";
import prisma from "@/libs/prisma";

export const expressValidator = async (req:any, res:any, validation: ValidationChain[]) => {
  // Ejecutar las validaciones
  await Promise.all(validation.map((step) => step.run(req)));
  const errors = validationResult(req);

  // Si hay errores, devolverlos como respuesta
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
};

// Definición de validadores
export const validator: any = {};

// Validador para crear un usuario
validator.createUser = checkSchema({
  username: {
    in: "body",
    isString: { errorMessage: "Input debe ser un string" },
    custom: {
      options: async (value) => {
        if (value) {
          const resultUser = await prisma.user.findFirst({
            where: {
              username: value,
            },
          });
          if (resultUser) {
            return Promise.reject("El usuario ya existe");
          }
        }
      },
    },
  },
  password: {
    in: "body",
    optional: true,
    isString: { errorMessage: "El input debe ser un string" },
  },
});

// Validador para obtener todas las tareas
validator.getAllTasks = checkSchema({
  page: {
    in: "query",
    optional: true,
    isString: { errorMessage: "El input debe ser un entero" },
  },
  limit: {
    in: "query",
    optional: true,
    isString: { errorMessage: "El input debe ser un entero" },
  },
  title: {
    in: "query",
    optional: true,
    isString: { errorMessage: "El input debe ser un string" },
  },
  assignedTo: {
    in: "body",
    optional: true,
    isArray: { errorMessage: "El input debe ser un array" },
    custom: {
      options: async (value) => {
        for (let id of value) {
          const user = await prisma.user.findFirst({
            where: {
              id: parseInt(id),
            },
          });
          if (!user) {
            return Promise.reject(`El usuario con este id ${id} no existe`);
          }
        }
      },
    },
  },
  priority: {
    in: "body",
    isIn: {
      options: [["low", "medium", "high"]],
      errorMessage: "El valor de prioridad es inválido",
    },
    optional: true,
  },
  status: {
    in: "body",
    isIn: {
      options: [["pending", "inProgress", "completed"]],
      errorMessage: "El valor de estado es inválido",
    },
    optional: true,
  },
});

// Validador para crear una tarea
validator.createTask = checkSchema({
  title: {
    in: "body",
    isString: { errorMessage: "El input debe ser un string" },
  },
  description: {
    in: "body",
    isString: { errorMessage: "El input debe ser un string" },
  },
  assignedTo: {
    in: "body",
    isArray: { errorMessage: "El input debe ser un array" },
    custom: {
      options: async (value) => {
        for (let id of value) {
          const user = await prisma.user.findFirst({
            where: {
              id: parseInt(id),
            },
          });
          if (!user) {
            return Promise.reject(`El usuario con este id ${id} no existe`);
          }
        }
      },
    },
  },
  dueDate: {
    in: "body",
    isString: { errorMessage: "El input debe ser un string" },
    custom: {
      options: async (value) => {
        if (value) {
          const date = new Date(value);
          if (isNaN(date.getTime())) return Promise.reject("La fecha es inválida");
        }
      },
    },
  },
  priority: {
    in: "body",
    isIn: {
      options: [["low", "medium", "high"]],
      errorMessage: "El valor de prioridad es inválido",
    },
    optional: true,
  },
  status: {
    in: "body",
    isIn: {
      options: [["pending", "inProgress", "completed"]],
      errorMessage: "El valor de estado es inválido",
    },
    optional: true,
  },
});

// Validador para actualizar una tarea
validator.taskExist = checkSchema({
  id: {
    in: "body",
    isString: { errorMessage: "Input debe ser un string" },
    custom: {
      options: async (id) => {
        if (id) {
          const task = await prisma.task.findFirst({
            where: {
              id: parseInt(id),
            },
          });
          if (!task) {
            return Promise.reject("El id no existe");
          }
        }
      },
    },
  },
  assignedTo: {
    in: "body",
    optional: true,
    isArray: { errorMessage: "El input debe ser un array" },
    custom: {
      options: async (value) => {
        for (let id of value) {
          const user = await prisma.user.findFirst({
            where: {
              id: parseInt(id),
            },
          });
          if (!user) {
            return Promise.reject(`El usuario con este id ${id} no existe`);
          }
        }
      },
    },
  },
});

validator.taskExistQuery = checkSchema({
  id: {
    in: "query",
    isString: { errorMessage: "Input debe ser un string" },
    custom: {
      options: async (id) => {
        if (id) {
          const task = await prisma.task.findFirst({
            where: {
              id: parseInt(id),
            },
          });
          if (!task) {
            return Promise.reject("El id no existe");
          }
        }
      },
    },
  },
});