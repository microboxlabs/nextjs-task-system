import useGroup from "@/hooks/useGroup"
import { Button, Spinner } from "flowbite-react"
import TableGroups from "./TableGroups"

interface GroupsListProps {
    fnDetails: (group: any) => void; // Ajusta 'any' al tipo real de 'group'
}

export default function GroupsList({ fnDetails }: GroupsListProps) {
    const { allGroups, handleDeleteGroup, loading } = useGroup();

    return (
        loading ? 
            <Spinner aria-label="Spinner" className="" size="xl" /> :
        allGroups && allGroups.length > 0 ? allGroups.map(g =>
            <div key={g.id} className="w-full max-w-2xl flex flex-col gap-3">
                <div className="flex justify-start items-center gap-3">
                    <p className="text-start dark:text-white font-bold">{g.name}</p>
                    <Button onClick={() => fnDetails(g)} color="dark" size="xs">Edit</Button>
                    <Button onClick={() => handleDeleteGroup(g.id)} color="dark" size="xs">Delete</Button>
                </div>
                <div className="border-[1px] dark:border-gray-700 rounded-xl">
                    <TableGroups usersMembers={g.users} />
                </div>
            </div>
        ) :
        <p className="text-white">No groups found</p>
    )
}