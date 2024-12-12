
"use client";

import { Avatar, Dropdown, Navbar } from "flowbite-react";

export function NavBar() {
    return (
        <Navbar fluid rounded className="bg-gray-50">
            <Navbar.Brand href="https://flowbite-react.com">

            </Navbar.Brand>
            <div className="flex md:order-2">
                <Dropdown
                    arrowIcon={false}
                    inline
                    label={
                        <Avatar
                            alt="User settings"
                            img="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                            rounded
                        />
                    }
                >
                    <Dropdown.Header>
                        <span className="block text-sm">Bonnie Green</span>
                        <span className="block truncate text-sm font-medium">
                            name@flowbite.com
                        </span>
                    </Dropdown.Header>
                    <Dropdown.Item>Sign out</Dropdown.Item>
                </Dropdown>
                <Navbar.Toggle />
            </div>
            <Navbar.Collapse>
                <Navbar.Link href="#" active>
                    Home
                </Navbar.Link>
                <Navbar.Link href="#">Tasks</Navbar.Link>
                <Navbar.Link href="#">Managing Tasks</Navbar.Link>
            </Navbar.Collapse>
        </Navbar>
    );
}
