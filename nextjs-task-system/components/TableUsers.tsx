import React, { useEffect, useState } from "react";
import Pagination from "./Pagination";
import { getAllUsers } from "@/libs/axios";
import ListSkeleton from "./ListSkeleton";
import { format } from "date-fns";
import { useTheme } from "@/store";

export default function TableUser() {
  const { t } = useTheme((state) => state);
  const limit = 10;
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  useEffect(() => {
    filter(currentPage);
  }, [currentPage]);

  const filter = async (page: number) => {
    setIsLoading(true);
    const resp = await getAllUsers(`page=${page}&limit=${limit}`);
    setTotalItems(resp.totalItems);
    setTotalPages(resp.totalPages);
    setUsers(resp.data);
    setIsLoading(false);
  };

  return (
    <div className="flex h-full min-h-screen w-full flex-col gap-[20px] p-[30px]">
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
                    className=" mb-[2px] rounded-md border-2  border-[--bg-color5] bg-[--bg-color3]"
                  >
                    <td className="pl-[30px]">{step.id}</td>
                    <td>{step.username}</td>
                    <td>
                      <p className="text-white bg-[#4b24db] w-fit rounded-full px-5 py-1 my-1">
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
                <div className="flex w-full items-center justify-between border-b-[1px] border-[--inputsBorder] py-[10px]">
                  <p className="text-xs">ID</p>
                  <p>{step.id}</p>
                </div>
                <div className="flex w-full items-center justify-between border-b-[1px] border-[--inputsBorder] py-[10px]">
                  <p className="text-xs">{t.username}</p>
                  <p>{step.username}</p>
                </div>

                <div className="flex w-full items-center justify-between border-b-[1px] border-[--inputsBorder] py-[10px]">
                  <p className="text-xs">{t.role}</p>
                  <p className="text-alertSuccess bg-alertSuccessBg w-fit rounded-full px-5 py-1">
                    {step.role}
                  </p>
                </div>
                <div className="flex w-full items-center justify-between border-b-[1px] border-[--inputsBorder] py-[10px]">
                  <p className="text-xs">{t.updatedAt}</p>
                  <p className="text-alertSuccess bg-alertSuccessBg w-fit rounded-full px-5 py-1">
                    {step.updatedAt}
                  </p>
                </div>
                <div className="flex w-full items-center justify-between border-b-[1px] border-[--inputsBorder] py-[10px]">
                  <p className="text-xs">{t.numberTasks}</p>
                  <p className="text-alertSuccess bg-alertSuccessBg w-fit rounded-full px-5 py-1">
                    {step.tasks.length}
                  </p>
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
