"use client";
import { Button, Label, TextInput, Select, Card } from "flowbite-react";
import Link from "next/link";
import { ForwardedMyButton } from "@/components/ButtonLink";
import { useUsers } from "@/hooks/useUsers";

export default function CreateUser() {
    const { handleCreateUser } = useUsers()

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        try {
            const form = event.target as HTMLFormElement;
            const name = (form.querySelector("[name='name']") as HTMLInputElement)?.value;;
            const email = (form.querySelector("[name='email']") as HTMLInputElement)?.value;
            const role = (form.querySelector("[name='role']") as HTMLSelectElement)?.value;
            const password = (form.querySelector("[name='password']") as HTMLInputElement)?.value;
            const repassword = (form.querySelector("[name='repassword']") as HTMLInputElement)?.value;

            if (password !== repassword) {
                throw new Error('Password and Re-Password must by equals.')
            }

            await handleCreateUser({
                name,
                email,
                password,
                role,
            })

            form.reset()
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <h1 className="text-2xl font-bold dark:text-white text-center pt-6">Create User</h1>
            <div className="flex flex-col items-center m-3 gap-3 mb-9">
                <div className="my-3 w-full max-w-2xl flex justify-end">
                    <Link href={'/admin/dashboard'}>
                        <ForwardedMyButton label="Back" />
                    </Link>
                </div>
                <Card className="w-full max-w-2xl">
                    <h2 className="text-xl font-semibold dark:text-white text-start">New User</h2>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="newUserName" value="Name" />
                            </div>
                            <TextInput id="newUserName" name="name" placeholder="User Name" required />
                        </div>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="newUserEmail" value="Email" />
                            </div>
                            <TextInput id="newUserEmail" name="email" placeholder="User Email" required />
                        </div>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="newUserRole" value="Role" />
                            </div>
                            <Select id="newUserRole" name="role" required>
                                <option>User</option>
                                <option>Admin</option>
                            </Select>
                        </div>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="newUserPassword" value="Password" />
                            </div>
                            <TextInput id="newUserPassword" name="password" type="password" placeholder="Password" required />
                        </div>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="newUserPasswordRE" value="Re-Password" />
                            </div>
                            <TextInput id="newUserPasswordRE" name="repassword" type="password" placeholder="Repeat Password" required />
                        </div>
                        <Button className="mt-3" type="submit">Submit</Button>
                    </form>
                </Card>
            </div>
        </>
    );
}