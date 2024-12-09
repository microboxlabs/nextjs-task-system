import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../../../../prisma/client';
import { group } from 'console';

export async function POST(req) {
    const { email, password } = await req.json();

    try {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return new Response(JSON.stringify({ message: 'Invalid credentials' }), { status: 401 });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return new Response(JSON.stringify({ message: 'Invalid credentials' }), { status: 401 });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role, groupId: user.groupId },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        return new Response(JSON.stringify({ token }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
