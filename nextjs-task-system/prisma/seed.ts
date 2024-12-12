import { PrismaClient } from "@prisma/client";
import { env } from "process";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const main = async () => {
  const admin = await prisma.users.create({
    data: {
      name: "Admin",
      email: env.ADMIN_EMAIL || " ",
      password: await bcrypt.hash(env.ADMIN_PASSWORD || " ", 12),
      role: "ADMIN",
    },
  });
  const user = await prisma.users.create({
    data: {
      name: "Joseph",
      email: "user@task-system.cl",
      password: await bcrypt.hash("user", 12),
      role: "USER",
    },
  });
  const user2 = await prisma.users.create({
    data: {
        name: "Martha",
        email: "user2@task-system.cl",
        password: await bcrypt.hash("user2", 12),
        role: "USER",
      },
  });
  const user3 = await prisma.users.create({
    data: {
        name: "Patrick",
        email: "user3@task-system.cl",
        password: await bcrypt.hash("user3", 12),
        role: "USER",
      },
  });
  const group1 = await prisma.groups.create({
    data: {
      name: "Team developer",
    },
  });
  const group2 = await prisma.groups.create({
    data: {
      name: "Team QA",
    },
  });
  const usersGroups = await prisma.groupMembers.createMany({
    data: [
      {
        userId: user.id,
        groupId: group1.id,
      },
      {
        userId: user2.id,
        groupId: group1.id,
      },
      {
        userId: user3.id,
        groupId: group2.id,
      },
    ],
  });
  const tasks = await prisma.tasks.createMany({
    data: [
      {
        title: "Diagrama BBDD",
        description:
          "Realizar el diagrama entidad-relación de la base de datos, de acuerdo a los requerimientos y los casos de uso",
        assigned_to: user.id,
        group_id: group1.id,
        due_date: new Date("2025-01-31"),
      },
      {
        title: "Diagrama estructura",
        description:
          "Realizar el diagrama de estructura de la aplicación, de acuerdo a los requerimientos y los casos de uso",
        assigned_to: user.id,
        group_id: group1.id,
        due_date: new Date("2025-01-31"),
      },
      {
        title: "Revision de funcionalidades basicas",
        description:
          "Realizar pruebas unitarias para chequear el correcto funcionamiento de las funcionalidades basicas",
        assigned_to: user3.id,
        group_id: group2.id,
        due_date: new Date("2025-02-15"),
      }
    ],
  });
  console.log("database seeded");
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
