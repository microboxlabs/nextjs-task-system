import React, { createContext, useContext, useState, useEffect } from 'react';
import { Group } from '@/types/users';
type Params = Promise<{ groupId: string }>

interface GroupContextType {
    allGroups: Group[];
    loading: boolean;
    fetchGroups: () => Promise<void>;
    handleCreateGroup: (groupData: any) => Promise<void>;
    handleDeleteGroup: (groupId: string) => Promise<void>;
    handleUpdateGroup: (groupData: Group) => Promise<void>;
}

// Crea el contexto
export const GroupContext = createContext<GroupContextType | undefined>(undefined);

// Función que proporciona el contexto
export function GroupProvider({ children }: { children: React.ReactNode }) {
    const [allGroups, setAllGroups] = useState<Group[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    // Función para obtener grupos
    const fetchGroups = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/admin/group');
            const data = await response.json();
            setAllGroups(data);
        } catch (error) {
            console.error('Error fetching groups', error);
        } finally {
            setLoading(false);
        }
    };

    // Función para crear un nuevo grupo
    const handleCreateGroup = async (groupData: any) => {
        try {
            const response = await fetch('/api/admin/group', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(groupData),
            });
    
            if (response.ok) {
                const { newGroup } = await response.json();
                setAllGroups((prev) => [...prev, newGroup]);
                alert("Group created successfully");
            } else {
                const errorResponse = await response.json();
                console.error(errorResponse);
                alert("Failed to create group");
            }
        } catch (error) {
            console.error('Unexpected error:', error);
            alert("An unexpected error occurred while trying to create the group.");
        }
    };

    // Función para eliminar un grupo
    const handleDeleteGroup = async (groupId: string) => {
        try {
            const response = await fetch(`/api/admin/group?id=${groupId}`, {
                method: 'DELETE'
            });
    
            if (response.ok) {
                setAllGroups((prev) => prev.filter(group => group.id !== groupId));
                alert("Group deleted successfully");
            } else {
                const errorResponse = await response.json();
                console.error(errorResponse);
                alert("Failed to delete group");
            }
        } catch (error) {
            console.error('Unexpected error:', error);
            alert("An unexpected error occurred while trying to delete the group.");
        }
    };

    // Función para actualizar un grupo
    const handleUpdateGroup = async (groupData: Group) => {
        try {
            const response = await fetch('/api/admin/group', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(groupData),
            });
    
            if (response.ok) {
                const { groupUpdated } = await response.json();
                
                setAllGroups((prev) =>
                    prev.map((group) => (group.id === groupData.id ? groupUpdated : group))
                  );
                alert("Group updated successfully");
            } else {
                const errorResponse = await response.json();
                console.error(errorResponse);
                alert("Failed to update group");
            }
        } catch (error) {
            console.error('Unexpected error:', error);
            alert("An unexpected error occurred while trying to update the group.");
        }
    };

    useEffect(() => {
        fetchGroups();
    }, []);

    return (
        <GroupContext.Provider
            value={{
                allGroups,
                loading,
                fetchGroups,
                handleCreateGroup,
                handleDeleteGroup,
                handleUpdateGroup
            }}
        >
            {children}
        </GroupContext.Provider>
    );
}