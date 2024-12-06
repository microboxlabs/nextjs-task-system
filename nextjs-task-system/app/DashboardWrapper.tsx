import Header from '@/components/Header'
import SideBarMenu from '@/components/SideBarMenu'
import React from 'react'

const DashboardWrapper = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className='flex min-h-screen w-full'>
            <SideBarMenu />
            <main className='flex w-full flex-col '>
                <Header />
                {children}
            </main>
        </div>
    )
}

export default DashboardWrapper