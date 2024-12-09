import React from 'react'
import DashboardWrapper from '../DashboardWrapper'
import BoardView from '@/components/boardView/BoardView'

const Board = () => {
    return (
        <DashboardWrapper>
            <main className="m-4 rounded-lg bg-gray-100">
                <BoardView />
            </main>
        </DashboardWrapper>
    )
}

export default Board