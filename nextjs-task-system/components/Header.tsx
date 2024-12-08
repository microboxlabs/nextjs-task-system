import React from 'react'
import Link from "next/link";
import { Navbar, NavbarBrand, NavbarCollapse, NavbarLink, NavbarToggle } from "flowbite-react";
import { getServerSession } from 'next-auth';
import { authOptions } from '@/libs/auth';
import Logout from './Logout';

async function Header() {
    const session = await getServerSession(authOptions);

    return (
        <div className='px-5 pt-6 '>
            {session?.user && (
                <Navbar fluid  >
                    <Link href="/">
                        Home
                    </Link>
                    <NavbarToggle />
                    <NavbarCollapse >
                        <NavbarLink href="#" className='items-center text-center self-center m-auto'>Dashboard</NavbarLink>
                        <Logout />
                    </NavbarCollapse>
                </Navbar>
            )}
        </div>
    )
}

export default Header