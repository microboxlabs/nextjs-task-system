'use client'

import { useState, useEffect } from 'react';
import { Card, Button } from 'flowbite-react';
import Link from 'next/link';

interface Group {
    id: string;
    name: string;
}

interface User {
    id: string;
    email: string;
    role: string;
}

interface UserGroup {
    group: Group;
}

export const TeamsPage = () => {
    const [user, setUser] = useState<User | null>(null);
    const [groupId, setGroupId] = useState('');
    const [userGroups, setUserGroups] = useState<UserGroup[]>([]);
    const [groups, setGroups] = useState<Group[]>([]);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch("/api/v1/me");
                const data = await response.json();
                setUser(data);
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        };
        fetchUser();
    }, []);

    useEffect(() => {
        if (user?.role === 'USER') {
            fetchGroupsId()
        } else {
            fetchGroups()
        }
    }, [user])

    const fetchGroupsId = async () => {
        const res = await fetch(`/api/v1/usergroup/${user?.id}`)
        const data = await res.json()
        setUserGroups(data)
    }

    const fetchGroups = async () => {
        const res = await fetch('/api/v1/groups')
        const data = await res.json()
        setGroups(data)
    }


    return (
        <div className="m-auto mt-6 flex flex-wrap w-[80%] lg:w-[90%] flex-row gap-4">
            {user?.role === 'USER' ? (
                userGroups.map((group) => (
                    <Card key={group.group.id} className="mb-3 w-56">
                        <h5 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
                            Team: {group.group.name}
                        </h5>
                        <Link href={`/dashboard/${group.group.id}`}>
                            <Button>Go to dashboard</Button>
                        </Link>
                    </Card>
                ))
            ) : (
                groups.map((group) => (

                    <Card key={group.id} className="mb-3 w-56">
                        <h5 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
                            Team: {group.name}
                        </h5>
                        <Link href={`/dashboard/${group.id}`}>
                            <Button>Go to dashboard</Button>
                        </Link>
                    </Card>
                ))
            )
            }
        </div>
    )
}
