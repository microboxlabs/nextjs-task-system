import { Navbar, NavbarBrand, NavbarCollapse, NavbarLink, NavbarToggle, Dropdown, Avatar, DropdownHeader, DarkThemeToggle } from "flowbite-react";
import { auth, signOut } from "@/utils/auth";
import { redirect } from "next/navigation";

export default async function NavbarApp() {
    const session = await auth()

    const desconectar = async () => {
        "use server"
        try {
            await signOut()
            redirect(`/auth/login`)
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Navbar fluid rounded className="min-h-[60px]">
            <NavbarBrand href="#">
                <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white py-auto">Task System</span>
            </NavbarBrand>
            
            {session?.user &&
                <>
                    <div className="flex md:order-10">
                        <Dropdown arrowIcon={false} inline
                            label={session.user.image ?
                                <Avatar alt="User settings" className="mr-3" img={`${session.user.image}`} rounded />
                                :
                                <div className="rounded-full w-8 h-8 border-[1px] mr-3 border-gray-600 bg-gray-400 flex justify-center items-center hover:bg-gray-500">
                                    <p>U</p>
                                </div>
                            }
                        >
                            <DropdownHeader>
                                <span className="block text-sm">{session.user.name} <span className="text-gray-400">{session.user.role}</span></span>
                                <span className="block truncate text-xs font-medium">{session.user.email}</span>
                            </DropdownHeader>
                            <form action={desconectar}>
                                <button type="submit" className="text-left text-sm w-full p-2 px-4 dark:hover:bg-gray-600 hover:bg-gray-200">
                                    Sign out
                                </button>
                            </form>
                        </Dropdown>
                        <NavbarToggle />
                    </div>
                    <NavbarCollapse>
                        <NavbarLink href={session.user.role === 'admin' ? '/admin/dashboard' : '/user/dashboard'} active>
                            Dashboard
                        </NavbarLink>
                        <NavbarLink href="#" className="hidden">About</NavbarLink>
                    </NavbarCollapse>
                </>
            }
            
            <div className="absolute right-[45%] md:right-24 top-[1%]">
                <DarkThemeToggle />
            </div>
        </Navbar>
    )
}