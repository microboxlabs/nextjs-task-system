import React from 'react'
import { getServerSession } from 'next-auth';
import { authOptions } from '@/libs/auth';
import Logout from './Logout';

async function Header() {
    const session = await getServerSession(authOptions);

    return (
        <div className='text-end px-5 pt-6 '>
            {session?.user && (
                <div>
                    <Logout />
                </div>
            )}
        </div>
    )
}

export default Header