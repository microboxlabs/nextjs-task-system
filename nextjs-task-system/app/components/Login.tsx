
"use client";

import React, { useEffect, useState } from "react";
import { jwtDecode, JwtPayload } from 'jwt-decode';
import Cookies from 'js-cookie';
import { useRouter } from "next/navigation";
import { Button, Card, Checkbox, Label, TextInput } from "flowbite-react";
import { UserModal } from "@/app/components/UserModal";
import { login } from "@/services/userService";

interface CustomJwtPayload extends JwtPayload {
    id: string;
    role: string;
}


export function CardComponent() {
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({});
    const [userData, setUserData] = useState({ email: "", password: "" });

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    };

    const handleLogin = async () => {
        try {
            const response = await login(userData);
            if (response) {
                const decoded = jwtDecode<CustomJwtPayload>(response.token);
                Cookies.set("token", response.token);

                if (decoded.role === "Admin") {
                    router.push("/pages/Task");
                } else if (decoded.role === "Regular") {
                    router.push("/pages/MyTask");
                }

            } else {
                alert("Login failed");
            }
        } catch (error) {
            console.error("Error logging in: ", error);
        }
    };




    return (
        <div className="flex flex-col gap-4">
            <Card className="max-w-sm">
                <form className="flex flex-col gap-4">
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="email1" value="Your email" />
                        </div>
                        <TextInput
                            id="email1"
                            type="email"
                            placeholder="name@flowbite.com"
                            name="email"
                            value={userData.email}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="password1" value="Your password" />
                        </div>
                        <TextInput
                            id="password1"
                            type="password"
                            name="password"
                            value={userData.password}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <Button color="success" className="mt-4" onClick={handleOpenModal}>Create account</Button>
                    <Button onClick={handleLogin}>Login</Button>
                </form>
            </Card>
            <UserModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                formData={formData}
                setFormData={setFormData}
            />
        </div>
    );
}
