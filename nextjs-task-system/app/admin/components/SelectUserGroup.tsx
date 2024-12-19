import { Select, Spinner, Label } from "flowbite-react"
import { User, Group } from "@/types/users"
import { useUsers } from "@/hooks/useUsers"
import useGroup from "@/hooks/useGroup";

interface SelectUserGroupProps {
    assValue: object; // Solo aceptamos strings aquí
    fnOnChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export default function SelectUserGroup({ assValue, fnOnChange }: SelectUserGroupProps) {
    const { users, loading: userLoading } = useUsers();
    const { allGroups, loading: groupLoading } = useGroup();

    return (
        <>
            <div className="mb-2 block">
                <Label htmlFor="assignedTo" value="Assigned To" />

            </div>
            {userLoading && groupLoading ?
                <>
                    <Spinner size="md" />
                    <Select id="assignedTo" name="assignedTo" className="hidden"></Select>
                </>
                :
                <Select id="assignedTo" name="assignedTo" value={JSON.stringify(assValue)} onChange={fnOnChange} required>
                    <option value="">
                        Select an User or Group
                    </option>
                    <optgroup label="Users">
                        {users.length > 0 &&
                            users.map(u =>
                                <option key={u.id} value={JSON.stringify({ idAss: u.id, nameAss: u.name })}>{u.name}</option>
                            )}
                    </optgroup>
                    <optgroup label="Groups">
                        {allGroups.length > 0 &&
                            allGroups.map(g =>
                                <option key={g.id} value={JSON.stringify({ idAss: g.id, nameAss: g.name })}>{g.name}</option>
                            )}
                    </optgroup>
                </Select>
            }

        </>
    )
}