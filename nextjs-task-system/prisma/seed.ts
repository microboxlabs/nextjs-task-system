import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import bcrypt from "bcryptjs";

async function main() {
    const testPassword = 'test1234'
    const testEncryptedPassword = await bcrypt.hash(testPassword, 10)
    console.log(testEncryptedPassword);
    
    const admin = await prisma.user.upsert({
        where: { email: 'admin@test.com' },
        update: {},
        create: {
            name: 'Admin',
            email: 'admin@test.com',
            password: testEncryptedPassword,
            role: 'admin',
        },
    })
    const user = await prisma.user.upsert({
        where: { email: 'user@test.com' },
        update: {},
        create: {
            name: 'Test User',
            email: 'user@test.com',
            password: testEncryptedPassword,
            role: 'user',
        },
    })
    console.log({ admin, user })
}
main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })