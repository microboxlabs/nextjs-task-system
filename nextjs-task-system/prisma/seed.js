const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const SALTS = 10
const prisma = new PrismaClient();

async function main() {
  const adminHashedPassword = await bcrypt.hashSync("admin", SALTS);
  const userHashedPassword = await bcrypt.hashSync("user", SALTS);

  // Check if users already exist before creating them
  const existingAdmin = await prisma.user.findFirst({
    where: { email: "admin@gmail.com" },
  });

  const existingUser = await prisma.user.findFirst({
    where: { email: "user@gmail.com" },
  });

  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        name: "John Doe",
        email: "admin@gmail.com",
        password: adminHashedPassword,
        role: "Admin",
      },
    });
    console.log("user with role admin created");
  } else {
    console.log("Admin user already exists, skipping creation.");
  }

  if (!existingUser) {
    await prisma.user.create({
      data: {
        name: "Jane Smith",
        email: "user@gmail.com",
        password: userHashedPassword,
        role: "User",
      },
    });
    console.log("user with role user created");
  } else {
    console.log("User user already exists, skipping creation.");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
