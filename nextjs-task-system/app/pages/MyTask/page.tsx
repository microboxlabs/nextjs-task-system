"use client"

import { MyTask } from '@/app/components/MyTask';
import { useAuthRedirect } from "../../utils/useAuthRedirect";

export default function TaskPage() {

    useAuthRedirect();

    return (
        <div className="text-center">
            <h1 className="text-2xl font-bold">My Task</h1>
            <MyTask />
        </div>
    )
}