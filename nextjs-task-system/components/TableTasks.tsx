'use client'
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Badge } from 'flowbite-react'

export default function TableTasks() {

    return (
        <Table hoverable>
            <TableHead>
                <TableHeadCell className="px-2">Title</TableHeadCell>
                <TableHeadCell className="px-1">Due Date</TableHeadCell>
                <TableHeadCell className="px-1">Priority</TableHeadCell>
                <TableHeadCell className="px-1 sm:px-6">Status</TableHeadCell>
            </TableHead>
            <TableBody className="divide-y">
                <TableRow onClick={() => console.log('drawer')} className="text-xs sm:text-sm bg-white dark:border-gray-700 dark:bg-gray-800 cursor-pointer">
                    <TableCell className="px-1 sm:px-3 whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        <div>
                            <p>{'Apple MacBook Pro"'}</p>
                            <p className='dark:text-gray-400 font-bold'>User1</p>
                        </div>
                    </TableCell>
                    <TableCell className="px-1 text-xs sm:text-sm">10/12/2024</TableCell>
                    <TableCell className="px-1 text-xs sm:text-sm">Low</TableCell>
                    <TableCell className="px-1 text-xs sm:text-sm"><Badge className='flex justify-center max-w-24' color="warning">Pending</Badge></TableCell>
                </TableRow>
                <TableRow className="text-xs sm:text-sm bg-white dark:border-gray-700 dark:bg-gray-800 cursor-pointer">
                    <TableCell className="px-1 sm:px-3 whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        <div>
                            <p>Microsoft Surface Pro</p>
                            <p className='dark:text-gray-400 font-bold'>User2</p>
                        </div>
                    </TableCell>
                    <TableCell className="px-1 text-xs sm:text-sm">10/12/2024</TableCell>
                    <TableCell className="px-1 text-xs sm:text-sm">Medium</TableCell>
                    <TableCell className="px-1 text-xs sm:text-sm"><Badge className='flex justify-center max-w-24' color="blue">In Progress</Badge></TableCell>
                </TableRow>
                <TableRow className="text-xs sm:text-sm bg-white dark:border-gray-700 dark:bg-gray-800 cursor-pointer">
                    <TableCell className="px-1 sm:px-3 whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        <div>
                            <p>Magic Mouse 2</p>
                            <p className='dark:text-gray-400 font-bold'>User1</p>
                        </div>
                    </TableCell>
                    <TableCell className="px-1 text-xs sm:text-sm">10/12/2024</TableCell>
                    <TableCell className="px-1 text-xs sm:text-sm">High</TableCell>
                    <TableCell className="px-1 text-xs sm:text-sm"><Badge className='flex justify-center max-w-24' color="success">Completed</Badge></TableCell>
                </TableRow>
                <TableRow className="text-xs sm:text-sm bg-white dark:border-gray-700 dark:bg-gray-800 cursor-pointer">
                    <TableCell className="px-1 sm:px-3 whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        <div>
                            <p>Magic Mouse 2</p>
                            <p className='dark:text-gray-400 font-bold'>User1</p>
                        </div>
                    </TableCell>
                    <TableCell className="px-1 text-xs sm:text-sm">10/12/2024</TableCell>
                    <TableCell className="px-1 text-xs sm:text-sm">High</TableCell>
                    <TableCell className="px-1 text-xs sm:text-sm"><Badge className='flex justify-center max-w-24' color="blue">In Progress</Badge></TableCell>
                </TableRow>
                <TableRow className="text-xs sm:text-sm bg-white dark:border-gray-700 dark:bg-gray-800 cursor-pointer">
                    <TableCell className="px-1 sm:px-3 whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        <div>
                            <p>Magic Mouse 2</p>
                            <p className='dark:text-gray-400 font-bold'>User1</p>
                        </div>
                    </TableCell>
                    <TableCell className="px-1 text-xs sm:text-sm">10/12/2024</TableCell>
                    <TableCell className="px-1 text-xs sm:text-sm">High</TableCell>
                    <TableCell className="px-1 text-xs sm:text-sm"><Badge className='flex justify-center max-w-24' color="success">Completed</Badge></TableCell>
                </TableRow>
                <TableRow className="text-xs sm:text-sm bg-white dark:border-gray-700 dark:bg-gray-800 cursor-pointer">
                    <TableCell className="px-1 sm:px-3 whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        <div>
                            <p>Magic Mouse 2</p>
                            <p className='dark:text-gray-400 font-bold'>User1</p>
                        </div>
                    </TableCell>
                    <TableCell className="px-1 text-xs sm:text-sm">10/12/2024</TableCell>
                    <TableCell className="px-1 text-xs sm:text-sm">High</TableCell>
                    <TableCell className="px-1 text-xs sm:text-sm"><Badge className='flex justify-center max-w-24' color="success">Completed</Badge></TableCell>
                </TableRow>
            </TableBody>
        </Table>
    )
}