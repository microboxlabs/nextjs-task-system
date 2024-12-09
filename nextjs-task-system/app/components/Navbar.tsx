
"use client";

import React, { useEffect, useState } from 'react';
import { Avatar, Dropdown, Navbar } from "flowbite-react";
import { jwtDecode, JwtPayload } from "jwt-decode";
import Cookies from "js-cookie";

interface CustomJwtPayload extends JwtPayload {
    role: string;
}

export function NavbarComponent() {
    const [user, setUser] = useState({});

    useEffect(() => {
        const token = Cookies.get("token");
        if (token) {
            try {
                const decoded = jwtDecode<CustomJwtPayload>(token);
                setUser(decoded.role);

            } catch (error) {
                console.error("Error decoding token: ", error);
            }
        }
    }, []);

    const handleLogout = () => {
        Cookies.remove("token");
        setUser({});
        window.location.href = "/";
    };

    return (

        <Navbar fluid rounded className="bg-slate-400 text-white dark:bg-gray-800 dark:text-gray-200" >
            <Navbar.Brand href="https://flowbite-react.com">
                <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Flowbite React</span>
            </Navbar.Brand>

            <div className="flex md:order-2">
                {user && (
                    <Dropdown
                        arrowIcon={false}
                        inline
                        label={
                            <Avatar alt="User settings" img="https://flowbite.com/docs/images/people/profile-picture-5.jpg" rounded />
                        }
                    >
                        <Dropdown.Header>
                            <span className="block text-sm">
                                {user === "Admin" ? "Admin" : "Regular"}
                            </span>
                        </Dropdown.Header>
                        <Dropdown.Divider />
                        <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                    </Dropdown>
                )}
                <Navbar.Toggle />
            </div>
            <Navbar.Collapse>
                <Navbar.Link href="/" active>
                    Home
                </Navbar.Link>
                <Navbar.Link href="/pages/Login">Login</Navbar.Link>
                {user === "Admin" && (
                    <>
                        <Navbar.Link href="/pages/User">Users</Navbar.Link>
                        <Navbar.Link href="/pages/Task">Tasks</Navbar.Link>
                        <Navbar.Link href="/pages/Group">Groups</Navbar.Link>
                    </>
                )}

                {user === "Regular" && (
                    <>
                        <Navbar.Link href="/pages/MyTask">My Tasks</Navbar.Link>
                    </>
                )}
            </Navbar.Collapse>
        </Navbar>
    );
}
