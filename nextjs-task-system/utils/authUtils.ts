import { NextResponse } from 'next/server';
import { auth } from '@/utils/auth';
import { Session } from 'next-auth'

interface AuthorizationResult {
    status: number;
    response?: NextResponse;
    session?: Session;
    userRole?: UserRole;
}

export const isValidRole = (role: string | undefined): role is UserRole =>
    ['admin', 'user'].includes(role ?? '');

//Por rol exacto
function checkPermissions(role: UserRole, requiredRole: UserRole): boolean {
    return role === requiredRole;
}

//Por jerarquía
/*export const checkPermissions = (role: UserRole, requiredRole: UserRole): boolean => {
    const roleHierarchy = ['guest', 'user', 'admin']; // Orden de jerarquía
    return roleHierarchy.indexOf(role) >= roleHierarchy.indexOf(requiredRole);
};*/

export const authorizeUser = async (requiredRole: UserRole): Promise<AuthorizationResult> => {
    const session = await auth();

    if (!session) {
        return { status: 401, response: NextResponse.json(null, { status: 401 }) };
    }

    const userRole: UserRole = isValidRole(session.user.role) ? session.user.role : 'guest';

    if (!checkPermissions(userRole, requiredRole)) {
        return { status: 403, response: NextResponse.json(null, { status: 403 }) };
    }

    return { status: 200, session, userRole };
};