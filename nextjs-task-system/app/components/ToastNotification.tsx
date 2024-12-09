
"use client";

import { useState } from "react";
import { Toast } from "flowbite-react";
import { HiCheck, HiX } from "react-icons/hi";

interface ToastNotificationProps {
    message: string;
    type: "success" | "error";
    duration?: number;
}

export default function ToastNotification({ message, type, duration = 5000 }: ToastNotificationProps) {
    const [isOpen, setIsOpen] = useState(true);

    setTimeout(() => setIsOpen(false), duration);

    if (!isOpen) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <Toast>
                <div
                    className={`inline-flex size-8 shrink-0 items-center justify-center rounded-lg ${type === "success" ? "bg-green-100 text-green-500" : "bg-red-100 text-red-500"
                        }`}
                >
                    {type === "success" ? <HiCheck className="size-5" /> : <HiX className="size-5" />}
                </div>
                <div className="ml-3 text-sm font-normal">{message}</div>
                <button
                    className="-m-1.5 ml-auto rounded-lg bg-white p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-900"
                    onClick={() => setIsOpen(false)}
                >
                    <HiX className="size-5" />
                </button>
            </Toast>
        </div>
    );
}
