
"use client";

import { Avatar, Dropdown, Navbar } from "flowbite-react";
import { AuthContexts } from "../contexts/authContexts";
import { useContext } from "react";



export function NavBar() {

    const { state, logout } = useContext(AuthContexts);
    
    const signOut = () => {
        logout();
    };

    return (
        <Navbar fluid rounded className="bg-gray-50">
            <Navbar.Brand href="https://flowbite-react.com">

            </Navbar.Brand>
            <div className="flex md:order-2">
                {state.user &&
                    <Dropdown
                        arrowIcon={false}
                        inline
                        label={
                            <div className="shadow-lg border-2 border-grey-darker border-solid rounded-full">
                                <Avatar
                                    rounded
                                />
                            </div>

                        }
                    >
                        <Dropdown.Header>
                            <span className="block text-sm">{state.user.username}</span>
                            <span className="block truncate text-sm font-medium">
                                {state.user.email}
                            </span>
                        </Dropdown.Header>
                        <Dropdown.Item onClick={signOut}>Sign out</Dropdown.Item>
                    </Dropdown>
                }
                <Navbar.Toggle />
            </div>
            <Navbar.Collapse>
                <Navbar.Link className="text-xxl" href="/dashboard/tasks" active>
                    Manager Task
                </Navbar.Link>
            </Navbar.Collapse>
        </Navbar>
    );
}
