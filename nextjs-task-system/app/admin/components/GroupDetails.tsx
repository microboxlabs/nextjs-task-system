'use client'
import { useState, useEffect } from "react";
import { Button, Drawer, Label, Select, TextInput, List } from "flowbite-react";
import { Group, UserGroup } from "@/types/users";
import { v4 as uuidv4 } from 'uuid';
import { useUsers } from "@/hooks/useUsers";
import useGroup from "@/hooks/useGroup";

interface GroupDetailsProps {
    isOpen: boolean; // Indica si el Drawer está abierto o cerrado
    handleClose: () => void; // Función para cerrar el Drawer
    group: Group | null;
}

export default function GroupDetails({ isOpen, handleClose, group }: GroupDetailsProps) {
    const { users, loading, error } = useUsers();
    const [listUsers, setListUsers] = useState<UserGroup[]>([]);
    const [groupName, setGroupName] = useState<string>("");
    const { handleUpdateGroup } = useGroup();

    const addUser = (userString: string) => {
        const user = JSON.parse(userString);

        if (user && !listUsers.find(u => u.user.id === user.id)) {
            const newUserGroup: UserGroup = {
                id: uuidv4(),
                userId: user.id,
                groupId: group?.id || "",
                user
            };
            setListUsers((prev) => [...prev, newUserGroup]);
        }
    };

    const removeUser = (id: string) => {
        setListUsers((prev) => prev.filter(u => u.user.id !== id));
    };

    const hasUser = (id: string) => {
        return listUsers.some(u => u.user.id === id);
    };

    const handleResetSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = e.target.value;
        if (selectedValue) {
            addUser(selectedValue);
        }
        // Limpiar la selección en el select
        e.target.value = "";
    };

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const name = groupName;
        const userIds = listUsers.length > 0 ? listUsers.map(uids => uids.user.id) : null;
        const id = group?.id

        if(id){
            await handleUpdateGroup({
                id,
                name,
                userIds,
            })
        } 

    }

    useEffect(() => {
        setGroupName(group?.name || "")
        setListUsers(group?.users || [])
    }, [isOpen])

    return (
        <Drawer open={isOpen} onClose={handleClose}>
            <Drawer.Header title={group?.name} />
            <Drawer.Items>
                <form onSubmit={handleSubmit}>
                    <div className="mb-6 mt-3">
                        <Label htmlFor="actualGroupName" className="mb-2 block">Group Name</Label>
                        <TextInput id="actualGroupName" value={groupName} onChange={(e) => setGroupName(e.target.value)} name="actualGroupName" placeholder="UI/UX Team" type="text" />
                    </div>
                    <div className="mb-6">
                        <p className="dark:text-white text-sm font-medium">Group Members</p>
                        <List unstyled className="max-w-md divide-y divide-gray-200 dark:divide-gray-700 border-[1px] mt-2 rounded-lg dark:border-gray-600 dark:bg-gray-700">
                            {listUsers.length > 0 ?
                                listUsers.map(uil =>
                                    <List.Item key={uil.user.id} className="py-2 my-auto">
                                        <div className="flex gap-2 mx-2 justify-between items-center">
                                            <p className="truncate text-sm font-medium text-gray-900 dark:text-white ml-1">{uil.user.name}</p>
                                            <p className="truncate text-sm text-gray-500 dark:text-gray-400">{uil.user.email}</p>
                                            <svg onClick={() => removeUser(uil.user.id)} className="rounded-md border-gray-500 dark:hover:bg-gray-800 hover:bg-gray-200 p-1 dark:text-white" xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M14 11v6m-4-6v6M6 7v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7M4 7h16M7 7l2-4h6l2 4"></path></svg>
                                        </div>
                                    </List.Item>
                                )
                                :
                                <List.Item className="py-2">
                                    <div className="flex items-center space-x-4 rtl:space-x-reverse">
                                        <div className="w-full">
                                            <p className="truncate italic text-sm font-medium text-gray-900 dark:text-white text-center">No Users selected</p>
                                        </div>
                                    </div>
                                </List.Item>}
                        </List>
                    </div>
                    <div className="mb-6">
                        <Label htmlFor="detailGroupSelectUserGroup" className="mb-2 block">Select users to add</Label>
                        <Select id="detailGroupSelectUserGroup" name="detailGroupSelectUserGroup" onChange={handleResetSelection}>
                            <option value="" >Select User</option>
                            {users.length > 0 ? users.map(u =>
                                <option key={u.id} className={`${hasUser(u.id) ? `hidden` : ""}`} value={JSON.stringify(u)}>{u?.name}</option>)
                                :
                                <option disabled>No users</option>}
                        </Select>
                    </div>
                    <div className="mb-6 gap-3 flex flex-col">
                        <Button type="submit" className="w-full">Save</Button>
                    </div>
                </form>
            </Drawer.Items>
        </Drawer>
    )
}