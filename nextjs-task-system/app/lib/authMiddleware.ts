import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.SECRET_WORD || 'your-secret-key';

export async function authMiddleware(req: NextRequest) {
    const token = req.cookies.get('token')?.value; 
    if (!token) {
        return NextResponse.redirect(new URL('/', req.url));
    }
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        (req as any).user = decoded; 
        return NextResponse.next();
    } catch (err) {
        return NextResponse.redirect(new URL('/', req.url));
    }
}
