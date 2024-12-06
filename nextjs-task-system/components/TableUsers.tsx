import React, { useEffect, useState } from "react";
import Pagination from "./Pagination";
import { getAllUsers } from "@/libs/axios";
import ListSkeleton from "./ListSkeleton";
import { format } from "date-fns";
import { useTheme } from "@/store";

export interface User {
  id: string;
  username: string;
  role: string;
  updatedAt: Date;
  tasks: { length: number };
}

export interface UsersResponse {
  totalItems: number;
  totalPages: number;
  data: User[];
}

export default function TableUser() {
  const { t } = useTheme((state) => state);
  const limit = 10;
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handlePageChange = (newPage: number): void => {
    setCurrentPage(newPage);
  };

  useEffect(() => {
    filter(currentPage);
  }, [currentPage]);

  const filter = async (page: number): Promise<void> => {
    setIsLoading(true);
    const resp: UsersResponse | null = await getAllUsers(`page=${page}&limit=${limit}`);
    if(resp && resp.totalItems) setTotalItems(resp.totalItems);
    if(resp && resp.totalPages) setTotalPages(resp.totalPages);
    if(resp && resp.data) setUsers(resp.data);
    setIsLoading(false);
  };

  return (
    <div className="flex size-full min-h-screen flex-col gap-[20px] p-[30px]">
      <div className="flex w-full flex-col gap-[20px] md:flex-row md:items-center md:justify-between md:gap-0">
        <p className="text-xl font-semibold md:text-[28px]">
          {t.users}
        </p>
      </div>
      <p className="self-end">
        {totalItems} <span className="opacity-40">{t.inTotal}</span>
      </p>
      <div>
        <ListSkeleton totalItems={users?.length} loading={isLoading}>
          <div className="hidden w-full 2xl:flex">
            <table className="my-[20px] w-full table-auto">
              <thead className="font-bold">
                <tr>
                  <td className="py-[15px] pl-[30px]">ID</td>
                  <td>{t.username}</td>
                  <td>{t.role}</td>
                  <td>{t.updatedAt}</td>
                  <td>{t.numberTasks}</td>
                </tr>
              </thead>
              <tbody>
                {users.map((step) => (
                  <tr
                    key={step.id}
                    className="mb-[2px] rounded-md border-2  border-[--bg-color5] bg-[--bg-color3]"
                  >
                    <td className="pl-[30px]">{step.id}</td>
                    <td>{step.username}</td>
                    <td>
                      <p className="my-1 w-fit rounded-full bg-[#4b24db] px-5 py-1 text-white">
                        {step.role}
                      </p>
                    </td>
                    <td>{format(step.updatedAt, "dd/MM/yyyy pp")}</td>
                    <td>{step.tasks.length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-col gap-3 2xl:hidden">
            {users.map((step, i) => (
              <div
                key={i}
                className="fhd:hidden flex h-fit w-full flex-col rounded-md bg-[--bg-color3] p-[20px]"
              >
                <div className="flex w-full items-center justify-between border-b border-[--inputsBorder] py-[10px]">
                  <p className="text-xs">ID</p>
                  <p>{step.id}</p>
                </div>
                <div className="flex w-full items-center justify-between border-b border-[--inputsBorder] py-[10px]">
                  <p className="text-xs">{t.username}</p>
                  <p>{step.username}</p>
                </div>

                <div className="flex w-full items-center justify-between border-b border-[--inputsBorder] py-[10px]">
                  <p className="text-xs">{t.role}</p>
                  <p>{step.role}</p>
                </div>
                <div className="flex w-full items-center justify-between border-b border-[--inputsBorder] py-[10px]">
                  <p className="text-xs">{t.updatedAt}</p>
                  <p>{format(step.updatedAt, "dd/MM/yyyy pp")}</p>
                </div>
                <div className="flex w-full items-center justify-between border-b py-[10px]">
                  <p className="text-xs">{t.numberTasks}</p>
                  <p>{step.tasks.length}</p>
                </div>
              </div>
            ))}
          </div>
        </ListSkeleton>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
