"use client";

import { Toast } from "flowbite-react";
import { HiCheck, HiX } from "react-icons/hi";

export function Notification({ text, successfullyAction }: { text: string; successfullyAction: boolean }) {
    return (
        <div className="absolute top-0 right-0 m-4" >
            <Toast>
                <div
                    className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                        successfullyAction
                            ? "bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200"
                            : "bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200"
                    }`}
                >
                    {successfullyAction ? <HiCheck className="h-5 w-5" /> : <HiX className="h-5 w-5" />}
                </div>
                <div className="ml-3 text-sm font-normal">{text}</div>
                <Toast.Toggle />
            </Toast>
        </div>
    );
}
