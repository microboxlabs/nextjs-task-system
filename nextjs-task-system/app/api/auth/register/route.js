import bcrypt from 'bcrypt';
import prisma from '../../../../prisma/client';

export async function POST(req) {
    const { name, email, password, role, groupId } = await req.json();

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role,
                group: {
                    connect: {
                        id: groupId
                    }
                }
            }
        });
        return new Response(JSON.stringify(user), { status: 201 });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}