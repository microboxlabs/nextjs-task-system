import { validationResult, checkSchema } from "express-validator";
import prisma from "@/libs/prisma";

export const expressValidator = async (req, res, validation) => {
  await Promise.all(validation.map((step) => step.run(req)));
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
};


export const validator: any = {};

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
            return Promise.reject("usuario ya existe");
          }
        }
      },
    },
  },
  password: {
    in: "body",
    optional: true,
    isString: { errorMessage: "Input debe ser un string" },
  },
});

validator.getAllTasks = checkSchema({
  page: {
    in: "query",
    isInt: { errorMessage: "Input debe ser un entero" },
  },
  limit: {
    in: "query",
    isInt: { errorMessage: "Input debe ser un entero" },
  },
  title: {
    in: "query",
    optional: true,
    isString: { errorMessage: "Input debe ser un string" },
  },
  assignedTo: {
    in: "body",
    optional: true,
    isArray: { errorMessage: "Input debe ser un array" },
    custom: {
      options: async (value) => {
        for (let id of value) {
          const user = await prisma.user.findFirst({
            where: {
              id,
            },
          });
          if (!user) {
            return Promise.reject(`user con este id ${id} no existe`);
          }
        }
      },
    },
  },
  priority: {
    in: "body",
    isIn: {
        options: [[ "low", "medium", "high"]],
        errorMessage: "Invalid orderBy value",
    },
    optional: true
  },
  status: {
    in: "body",
    isIn: {
        options: [["pending", "inProgress", "completed"]],
        errorMessage: "Invalid orderBy value",
    },
    optional: true
  },
});

validator.createTask = checkSchema({
  title: {
    in: "body",
    isString: { errorMessage: "Input debe ser un string" },
  },
  description: {
    in: "body",
    isString: { errorMessage: "Input debe ser un string" },
  },
  assignedTo: {
    in: "body",
    optional: true,
    isArray: { errorMessage: "Input debe ser un array" },
    custom: {
      options: async (value) => {
        for (let id of value) {
          const user = await prisma.user.findFirst({
            where: {
              id: parseInt(id),
            },
          });
          if (!user) {
            return Promise.reject(`user con este id ${id} no existe`);
          }
        }
      },
    },
  },
  dueDate: {
    in: "body",
    isString: { errorMessage: "Input debe ser un string" },
    custom: {
      options: async (value) => {
        if (value) {
          const date = new Date(value);
          if (isNaN(date.getTime())) return Promise.reject("invalid_value");
        }
      },
    },
  },
  priority: {
    in: "body",
    isIn: {
        options: [[ "low", "medium", "high"]],
        errorMessage: "Invalid orderBy value",
    },
    optional: true
  },
  status: {
    in: "body",
    isIn: {
        options: [["pending", "inProgress", "completed"]],
        errorMessage: "Invalid orderBy value",
    },
    optional: true
  },
});


