import {  Role } from "@prisma/client";
import prisma from "../libs/prisma";

async function main() {
  // password password123
  const users = [
    {
      username: "admin",
      password: "$2a$10$J7DPqsgrmeMc9481EsfXt.TW5nyaYVEjVL7liDXxusxo8kG/RYE6S",
      role: Role.admin,
    },
    {
      username: "user1",
      password: "$2a$10$J7DPqsgrmeMc9481EsfXt.TW5nyaYVEjVL7liDXxusxo8kG/RYE6S",
      role: Role.regular,
    },
  ];
  await prisma.user.createMany({
    data: users,
  });
}

main()
  .then(() => {
    console.log("Seeders cargados correctamente created");
  })
  .catch((e) => {
    console.log("Error al cargar los seeders created:", e);
  });
