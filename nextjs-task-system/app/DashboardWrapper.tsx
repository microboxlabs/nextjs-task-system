import Header from '@/components/Header'
import SideBarMenu from '@/components/SideBarMenu'
import React from 'react'

const DashboardWrapper = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className='flex h-full w-full'>
            <SideBarMenu />
            <main className='flex w-full flex-col '>
                <Header />
                {children}
            </main>
        </div>
    )
}

export default DashboardWrapper