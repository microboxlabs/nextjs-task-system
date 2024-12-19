'use client'
import { useState } from "react";
import { Group } from "@/types/users";
import { Button } from "flowbite-react";
import Link from "next/link";
import { GroupProvider } from "@/contexts/GroupContext";
import { ForwardedMyButton } from "@/components/ButtonLink";
import NewGroup from "../components/NewGroup";
import GroupDetails from "../components/GroupDetails";
import GroupsList from "../components/GroupsList";

export default function Groups() {
    const [isOpen, setIsOpen] = useState(false); //Drawer New Group
    const [showDetails, setShowDetails] = useState(false); //Drawer Group Details
    const [groupSelected, setGroupSelected] = useState<Group | null>(null);

    const handleClose = () => setIsOpen(false);
    const handleOpenDetail = (g: Group) => {
        setGroupSelected(g);
        setShowDetails(true);
    }
    const handleCloseDetails = () => setShowDetails(false);

    return (
        <GroupProvider>
            <>
                <h1 className="text-2xl font-bold dark:text-white text-center pt-6">Groups Management</h1>
                <div className="flex flex-col items-center m-3 gap-6 mb-9">
                    <div className="my-3 w-full max-w-2xl flex justify-between">
                        <Button onClick={() => setIsOpen(true)}>Create Group</Button>
                        <Link href={'/admin/dashboard'}>
                            <ForwardedMyButton label="Back" />
                        </Link>
                    </div>
                    <GroupsList fnDetails={handleOpenDetail} />
                </div>
            </>
            <NewGroup isOpen={isOpen} handleClose={handleClose} />
            <GroupDetails isOpen={showDetails} handleClose={handleCloseDetails} group={groupSelected} />
        </GroupProvider>
    )
}