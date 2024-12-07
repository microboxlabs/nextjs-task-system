import { jwtVerify, SignJWT } from 'jose';
import { users } from './data';

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'default-secret-change-this-in-production'
);

export async function createToken(payload: any) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h')
        .sign(JWT_SECRET);
}

export async function verifyToken(token: string) {
    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        return payload;
    } catch (error) {
        return null;
    }
}

export async function validateCredentials(email: string, password: string) {

    const user = users.find(u => u.email === email && u.password === password)
    if (user) {
        return { 'id': user.id, 'user': user.name, 'role': user.role };
    }
    return null;
}