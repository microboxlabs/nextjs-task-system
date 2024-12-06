import { Priority, Role, Status, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const users = [
    { username: "admin", role: Role.admin },
    { username: "user1", role: Role.regular },
    { username: "user2", role: Role.regular },
    { username: "user3", role: Role.regular },
    { username: "user4", role: Role.regular },
  ];
  // password123
  const passwordHash =
  "$2a$10$J7DPqsgrmeMc9481EsfXt.TW5nyaYVEjVL7liDXxusxo8kG/RYE6S";

  await prisma.user.createMany({
    data: users.map((user) => {
      return {
        ...user,
        password: passwordHash,
      };
    }),
  });

  const tasks = [
    {
      title: "tarea 1",
      description: "description tarea 1",
      assignedTo: { connect: [{ id: 1 }, { id: 2 }] },
      dueDate: "2024-07-17T15:47:50.449+00:00",
      priority: Priority.low,
      status:  Status.pending,
    },
    {
      title: "tarea 2",
      description: "description 5",
      assignedTo: { connect: [{ id: 3 }] },
      dueDate: "2024-01-17T15:47:50.449+00:00",
      priority: Priority.high,
      status:  Status.inProgress,
    },
    {
      title: "tarea 3",
      description: "description 5",
      assignedTo: { connect: [{ id: 3}, { id: 5 }] },
      dueDate: "2024-03-17T15:47:50.449+00:00",
      priority: Priority.medium,
      status:  Status.inProgress,
    },
    {
      title: "tarea 4",
      description: "description 5",
      assignedTo: { connect: [{ id: 1 }, { id: 3}, { id: 5 }] },

      dueDate: "2024-11-03T15:47:50.449+00:00",
      priority: Priority.low,
      status:  Status.pending,
    },
    {
      title: "tarea 5",
      description: "description 5",
      assignedTo: { connect: [{ id: 2 }] },
      dueDate: "2024-01-12T15:47:50.449+00:00",
      priority: Priority.medium,
      status: Status.completed
    },
  ];
 
  await Promise.all(
    tasks.map((task) => prisma.task.create({ data: task }))
  );

  console.log("Seeders cargados correctamente.");
}

main()
  .catch((e) => {
    console.error("Error al cargar los seeders:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

export default main;