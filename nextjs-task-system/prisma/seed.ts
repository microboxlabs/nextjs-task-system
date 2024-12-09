import { PrismaClient } from "@prisma/client";
import { env } from "process";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const main = async () => {
  const admin = await prisma.users.create({
    data: {
      email: env.ADMIN_EMAIL || " ",
      password: await bcrypt.hash(env.ADMIN_PASSWORD || " ", 12),
      role: "ADMIN",
    },
  });
  const user = await prisma.users.create({
    data: {
      name: "User 1",
      email: "user@task-system.cl",
      password: await bcrypt.hash("user", 12),
      role: "USER",
    },
  });
  const group = await prisma.groups.create({
    data: {
      name: "Group 1",
    },
  });
  const usersGroups = await prisma.groupMembers.createMany({
    data: [
      {
        userId: admin.id,
        groupId: group.id,
      },
      {
        userId: user.id,
        groupId: group.id,
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
        group_id: group.id,
        due_date: new Date("2025-01-31"),
      },
      {
        title: "Diagrama estructura",
        description:
          "Realizar el diagrama de estructura de la aplicación, de acuerdo a los requerimientos y los casos de uso",
        assigned_to: user.id,
        group_id: group.id,
        due_date: new Date("2025-01-31"),
      },
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
