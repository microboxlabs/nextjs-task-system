"use client";

import { Button, Card, Checkbox, Label, TextInput } from "flowbite-react";

export default function Login() {
    return (
        <div>
            <main className="dark:bg-gray-800 h-screen w-screen flex justify-center items-center bg-grey-lighter">
                <div>
                    <Card className="w-full sm:w-[400px]">
                        <form className="flex flex-col gap-4">
                            <div>
                                <div className="mb-2 block">
                                    <Label htmlFor="email1" value="Email" />
                                </div>
                                <TextInput id="email1" type="email" placeholder="name@flowbite.com" required />
                            </div>
                            <div>
                                <div className="mb-2 block">
                                    <Label htmlFor="password1" value="Password" />
                                </div>
                                <TextInput id="password1" type="password" required />
                            </div>

                            <Button type="submit">Login</Button>
                        </form>
                    </Card>
                </div>
            </main>
        </div>
    );
}
