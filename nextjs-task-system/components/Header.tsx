import React from 'react'
import Link from "next/link";
import { Navbar, NavbarBrand, NavbarCollapse, NavbarLink, NavbarToggle } from "flowbite-react";
import { getServerSession } from 'next-auth';
import { authOptions } from '@/libs/auth';
import Logout from './Logout';

async function Header() {
    const session = await getServerSession(authOptions);

    return (
        <div className='p-5'>
            {session?.user && (
                <Navbar fluid >
                    <Link href="/">
                        Home
                    </Link>
                    <NavbarToggle />
                    <NavbarCollapse>
                        <NavbarLink href="#">Dashboard</NavbarLink>
                        <Logout />
                    </NavbarCollapse>
                </Navbar>
            )}
        </div>
    )
}

export default Header