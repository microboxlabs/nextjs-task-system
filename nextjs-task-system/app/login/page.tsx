"use client";

import { useContext, useEffect, useState } from "react";
import { Button, Card, Label, TextInput } from "flowbite-react";
import { Notification } from "../components/toast";
import { AuthContexts } from "../contexts/authContexts";


export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    // const [showNotification, setShowNotification] = useState(false);
    const {login,state} = useContext(AuthContexts);



    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        login(email,password);
        
    };


    return (
        <div>
            <main className="dark:bg-gray-800 h-screen w-screen flex justify-center items-center bg-grey-lighter">
                <div>
                    <Card className="w-full sm:w-[400px]">
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <div>
                                <div className="mb-2 block">
                                    <Label htmlFor="email" value="Email" />
                                </div>
                                <TextInput
                                    id="email"
                                    type="email"
                                    placeholder="name@flowbite.com"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div>
                                <div className="mb-2 block">
                                    <Label htmlFor="password" value="Password" />
                                </div>
                                <TextInput
                                    id="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <Button type="submit" disabled={loading}>
                                {loading ? "Logging in..." : "Login"}
                            </Button>
                        </form>
                    </Card>

                </div>
            </main>
        </div>
    );
}
