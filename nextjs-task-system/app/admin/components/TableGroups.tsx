 import { Table } from 'flowbite-react'

interface UserGroupMember {
    userId: string;
    groupId: string;
    user: {
        id: string;
        name: string;
        email: string;
    };
}

export default function TableGroups({ usersMembers }: { usersMembers: UserGroupMember[] }) {
    return (
        <Table hoverable className='w-full'>
            <Table.Head>
                <Table.HeadCell className="px-2">User</Table.HeadCell>
                <Table.HeadCell className="px-1">Email</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
                {usersMembers?.length > 0 ?
                    usersMembers.map(t =>
                        <Table.Row key={t.user.id} className="text-xs sm:text-sm bg-white dark:border-gray-700 dark:bg-gray-800 cursor-pointer">
                            <Table.Cell className="px-1 sm:px-3 whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                {t.user.name}
                            </Table.Cell>
                            <Table.Cell className="px-1 text-xs sm:text-sm">{t.user.email}</Table.Cell>
                        </Table.Row>
                    )
                    :
                    <Table.Row className='text-xs sm:text-sm bg-white dark:border-gray-700 dark:bg-gray-800'>
                        {["No users found", ""].map((content, index) => (
                            <Table.Cell key={index}>{content}</Table.Cell>
                        ))}
                    </Table.Row>
                }
            </Table.Body>
        </Table>
    )
}