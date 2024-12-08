import BoardViewContainer from '@/components/boardView/BoardViewContainer'
import { authOptions } from '@/libs/auth';
import { getServerSession } from 'next-auth';
import React from 'react'

export default async function Dashboard() {
    const session = await getServerSession(authOptions);

    return (
        <div className='overflow-hidden size-full'>
            <BoardViewContainer />
        </div>
    )
}
