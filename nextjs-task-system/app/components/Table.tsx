"use client";

import { useState, useEffect } from "react";
import { Table, Button, Pagination, TextInput, Select } from "flowbite-react";
import { HiPencil, HiOutlineTrash } from "react-icons/hi";

interface DataItem {
    [key: string]: any;
}

interface TableComponentProps {
    data: DataItem[];
    excludeColumns?: string[];
    pageSize: number;
    onEdit: (item: DataItem) => void;
    onDelete: (id: number) => void;
}

export function TableComponent({ data, excludeColumns, pageSize, onEdit, onDelete }: TableComponentProps) {

    const [currentPage, setCurrentPage] = useState(1);
    const [paginatedData, setPaginatedData] = useState<DataItem[]>([]);
    const [filters, setFilters] = useState<{ [key: string]: string }>({});


    const columns = data.length ? Object.keys(data[0]).filter((column) => !excludeColumns?.includes(column)) : [];

    useEffect(() => {

        const filteredData = data.filter(item => {
            return Object.keys(filters).every(key => {
                if (!filters[key]) return true;
                const value = item[key];

                if (typeof value === 'string') {
                    return value.toLowerCase().includes(filters[key].toLowerCase());
                } else if (value instanceof Date) {
                    return value.toLocaleDateString() === new Date(filters[key]).toLocaleDateString();
                } else {
                    return value === filters[key];
                }
            });
        });

        const start = (currentPage - 1) * pageSize;
        const end = start + pageSize;
        setPaginatedData(filteredData.slice(start, end));
    }, [currentPage, data, pageSize, filters]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleFilterChange = (column: string, value: string) => {
        setFilters(prev => ({ ...prev, [column]: value }));
    };

    return (
        <div className="overflow-x-auto">


            <div className="mb-4 flex space-x-4">
                {columns.map((column) => (
                    <div key={column} className="flex items-center">
                        {column === 'dueDate' ? (
                            <TextInput
                                type="date"
                                onChange={(e) => handleFilterChange(column, e.target.value)}
                                placeholder={`filter by ${column}`}
                            />
                        ) : (
                            <TextInput
                                type="text"
                                onChange={(e) => handleFilterChange(column, e.target.value)}
                                placeholder={`filter by ${column}`}
                            />
                        )}
                    </div>
                ))}
            </div>




            <Table striped>
                <Table.Head>
                    {columns.map((column, index) => (
                        <Table.HeadCell key={index}>
                            {column.charAt(0).toUpperCase() + column.slice(1)}
                        </Table.HeadCell>
                    ))}
                    <Table.HeadCell>Actions</Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                    {paginatedData.map((item, rowIndex) => (
                        <Table.Row key={rowIndex} className="bg-white hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
                            {columns.map((column, colIndex) => (
                                <Table.Cell key={colIndex} className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                    {Array.isArray(item[column]) ? (
                                        <div>
                                            {item[column].map((subItem: any, subIndex: number) => (
                                                <p key={subIndex}>{subItem}</p>
                                            ))}
                                        </div>
                                    ) : typeof item[column] === 'object' && item[column] !== null ? (

                                        <pre>{JSON.stringify(item[column], null, 2)}</pre>
                                    ) : (
                                        item[column]
                                    )
                                    }


                                </Table.Cell>
                            ))}
                            <Table.Cell>
                                <div className="flex items-center space-x-4">
                                    <Button size="sm" className="hover:bg-gray-200 dark:hover:bg-gray-700" onClick={() => onEdit(item)}>
                                        <HiPencil className="size-5" />
                                    </Button>

                                    <Button size="sm" className="bg-red-600 hover:bg-red-900 dark:hover:bg-red-700 " onClick={() => onDelete(item.id as number)}>
                                        <HiOutlineTrash className="size-5" />
                                    </Button>
                                </div>
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
            <div className="mt-4 flex justify-center">
                <Pagination
                    currentPage={currentPage}
                    totalPages={Math.ceil(data.length / pageSize)}
                    onPageChange={handlePageChange}
                />
            </div>

        </div>
    );
}
