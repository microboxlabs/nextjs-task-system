import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Limpia las tablas afectadas (opcional, si no tienes dependencias que lo impidan)
  await prisma.comment.deleteMany({});
  await prisma.task.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.group.deleteMany({});
  console.log("Tablas limpiadas correctamente.");

  // Crear contraseñas encriptadas
  const hashedAdminPassword = await bcrypt.hash("admin123", 10);
  const hashedRegularPassword = await bcrypt.hash("regular123", 10);


  // Crear grupos predefinidos
  const group1 = await prisma.group.create({
    data: { name: "Frontend" },
  });
  const group2 = await prisma.group.create({
    data: { name: "Backend" },
  });
  const group3 = await prisma.group.create({
    data: { name: "Mobile" },
  });

  // Crear un usuario Admin de ejemplo
  const adminUser = await prisma.user.create({
    data: {
      email: "admin@example.com",
      password: hashedAdminPassword,
      role: "ADMIN",
    },
  });

  // crear usuario regular
  const regularUser = await prisma.user.create({
    data: {
      email: "regular@example.com",
      password: hashedRegularPassword,
      role: "REGULAR",
      groupId: group1.id,
    },
  });

  const regularUser2 = await prisma.user.create({
    data: {
      email: "regular2@example.com",
      password: hashedRegularPassword,
      role: "REGULAR",
      groupId: group2.id,
    },
  });

  // Crear tareas predefinidas
  const task1 = await prisma.task.create({
    data: {
      title: "Tarea 1",
      description: "Descripción de la tarea 1",
      userId: null,
      groupId: group1.id,
      status: "PENDING",
      dueDate: new Date(),
    },
  });

  const task2 = await prisma.task.create({
    data: {
      title: "Tarea 2",
      description: "Descripción de la tarea 2",
      userId: regularUser.id,
      groupId: null,
      status: "IN_PROGRESS",
      dueDate: new Date(),
    },
  });

  const task3 = await prisma.task.create({
    data: {
      title: "Tarea 3",
      description: "Descripción de la tarea 3",
      userId: regularUser2.id,
      groupId: null,
      status: "COMPLETED",
      dueDate: new Date(),
    },
  });



  console.log("Admin user creado:", adminUser);
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });




