'use client'

import { useState } from 'react'
import { Button, Label, TextInput } from 'flowbite-react';
import { useRouter } from 'next/navigation'

export const CreateTeam = () => {
    const [groupName, setGroupName] = useState('')
    const [error, setError] = useState('')

    const router = useRouter()

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (groupName.trim() === '') {
            setError('The team name is required')
            return
        }
        const newTeam = fetch('/api/v1/groups', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: groupName })
        })
        router.push('/teams')

    }

    return (
        <div className="max-w-md mx-auto mt-8">
            <h2 className="text-2xl font-bold mb-4">Create Work Team</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <Label htmlFor="nombreEquipo" value="Team Name" />
                    <TextInput
                        id="nombreEquipo"
                        type="text"
                        placeholder="Enter team name"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                    />
                    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                </div>
                <Button type="submit">Create team</Button>
            </form>
        </div>
    )
}

