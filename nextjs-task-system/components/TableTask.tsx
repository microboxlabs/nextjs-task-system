import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { Delete, Edit } from "./Icons";
import Pagination from "./Pagination";
import { getAllTasks, deleteTask } from "@/libs/axios";
import ListSkeleton from "./ListSkeleton";
import ModalTask from "./ModalTask";
import { useForm } from "react-hook-form";
import { useAuthStore, useTheme } from "@/store";
import AddComment from "./AddComment";
import { Priority, Role, Status } from "@prisma/client";
import FilterTasks from "./FilterTasks";
import Swal from "sweetalert2";

export default function TableTask() {
  const { t } = useTheme((state) => state);
  const limit = 10;
  const [tasks, setTasks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [modalTask, setModalTask] = useState(false);
  const [addComment, setAddComment] = useState(false);
  const [filter, setFilter] = useState("");
  const { role } = useAuthStore((state) => state);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [filter, currentPage]);

  const fetchData = async (page: number) => {
    setIsLoading(true);
    const resp = await getAllTasks(`page=${page}&limit=${limit}&${filter}`);
    setTotalItems(resp.totalItems);
    setTotalPages(resp.totalPages);
    setTasks(resp.data);
    setIsLoading(false);
  };

  const onClickDelete = async (id: string) => {
    const confirmDelete = window.confirm(t.sureToDeleteThisItem);

    if (confirmDelete) {
      const response = await deleteTask(id);

      if (response.errors) {
        if (response.errors["errors"]) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: response.errors["errors"][0].msg,
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: t.anErrorHasOccurred,
          });
        }
      } else {
        Swal.fire({
          position: "center",
          icon: "success",
          text: t.deletedSuccessfully,
          showConfirmButton: false,
        });
        fetchData(currentPage);
      }
    } else {
      return;
    }
  };
  const { register, handleSubmit, reset, watch } = useForm();

  const handlerUpdate = (taks) => {
    reset({
      ...taks,
      dueDate: format(taks.dueDate, "yyyy-MM-dd"),
    });
    setModalTask(true);
  };

  const handlerAddComment = (taks) => {
    reset(taks);
    setAddComment(true);
  };

  return (
    <div className="flex h-full min-h-screen w-full flex-col gap-[20px] p-[30px]">
      {modalTask && (
        <ModalTask
          setModalTask={setModalTask}
          register={register}
          handleSubmit={handleSubmit}
          watch={watch}
          fetchData={fetchData}
          currentPage={currentPage}
        />
      )}

      {addComment && (
        <AddComment
          setAddComment={setAddComment}
          register={register}
          handleSubmit={handleSubmit}
          watch={watch}
          fetchData={fetchData}
          currentPage={currentPage}
        />
      )}
      <div className="flex w-full flex-col gap-[20px] md:flex-row md:items-center md:justify-between md:gap-0">
        <p className="text-xl font-semibold md:text-[28px]">
          {t.tasks}
        </p>
        {role == Role.admin && (
          <button
            className="flex h-[50px] items-center rounded-md bg-[#262c80] px-6 text-white"
            onClick={async () => {
              await reset({
                id: "",
                title: "",
                description: "",
                priority: Priority.low,
                status: Status.pending,
                assignedTo: "",
                dueDate: "",
              });
              setModalTask(true);
            }}
          >
            {t.newTask}
          </button>
        )}
      </div>
      <p className="self-end">
        {totalItems} <span className="opacity-40">{t.inTotal}</span>
      </p>
      <FilterTasks setFilter={setFilter}/>
      <div>
        <ListSkeleton totalItems={tasks?.length} loading={isLoading}>
          <div className="hidden w-full 2xl:flex">
            <table className="my-[20px] w-full table-auto">
              <thead className="font-bold">
                <tr>
                  <td className="py-[15px] pl-[30px]">ID</td>
                  <td>{t.title}</td>
                  <td>{t.description}</td>
                  <td>{t.priority}</td>
                  <td>{t.status}</td>
                  <td>{t.assignedTo}</td>
                  <td>{t.comments}</td>
                  <td>{t.dueDate}</td>
                  <td>{t.actions}</td>
                </tr>
              </thead>
              <tbody>
                {tasks.map((step) => (
                  <tr
                    key={step.id}
                    className=" mb-[2px] rounded-md border-2  border-[--bg-color5] bg-[--bg-color3]"
                  >
                    <td className="pl-[30px]">{step.id}</td>
                    <td>{step.title}</td>
                    <td>{step.description}</td>
                    <td>{step.priority}</td>
                    <td>{step.status}</td>
                    <td>{step.assignedTo.map((i) => i.username + " ")}</td>
                    <td>
                      <div className="flex flex-col gap-2 py-2">
                        <div className="flex flex-col gap-2 ">
                          {step.comments.map((i) => (
                            <div
                              key={i.id}
                              className="mx-1 border border-[#797979] p-1"
                            >
                              <p className="text-sm">{i.user.username}</p>
                              <p>{i.message}</p>
                            </div>
                          ))}
                        </div>

                        <button
                          onClick={() => handlerAddComment(step)}
                          className="text-alertSuccess w-fit rounded-full bg-[#262c80] px-5 py-1 text-white"
                        >
                          {t.addComment}
                        </button>
                      </div>
                    </td>
                    <td>{format(step.dueDate, "dd/MM/yyyy pp")}</td>

                    <td>
                      <div className="flex gap-3 py-[5px]">
                        <button
                          className="hidden  w-fit rounded-[--buttonRadius] bg-[#262c80] px-1 py-1 xl:flex"
                          onClick={() => handlerUpdate(step)}
                        >
                          <Edit />
                        </button>
                        <button
                          onClick={() => onClickDelete(step.id)}
                          className="bg-alertErrorBg hidden w-fit rounded-[--buttonRadius] bg-[#813535] px-1 py-1 xl:flex"
                        >
                          <Delete />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mb-4 flex flex-col gap-3 2xl:hidden">
            {tasks.map((step, i) => (
              <div
                key={i}
                className="fhd:hidden flex h-fit w-full flex-col rounded-md bg-[--bg-color4] p-[20px]"
              >
                <div className="flex w-full items-center justify-between border-b-[1px] border-[--bg-color1] py-[10px]">
                  <p className="text-xs">ID</p>
                  <p>{step.id}</p>
                </div>
                <div className="flex w-full items-center justify-between border-b-[1px] border-[--bg-color1] py-[10px]">
                  <p className="text-xs">{t.title}</p>
                  <p className="text-alertSuccess bg-alertSuccessBg w-fit rounded-full px-5 py-1">
                    {step.title}
                  </p>
                </div>
                <div className="flex w-full items-center justify-between border-b-[1px] border-[--bg-color1] py-[10px]">
                  <p className="text-xs">{t.description}</p>
                  <p> {step.description}</p>
                </div>
                <div className="flex w-full items-center justify-between border-b-[1px] border-[--bg-color1] py-[10px]">
                  <p className="text-xs">{t.priority}</p>
                  <p> {step.priority}</p>
                </div>
                <div className="flex w-full items-center justify-between border-b-[1px] border-[--bg-color1] py-[10px]">
                  <p className="text-xs">{t.descrstatusiption}</p>
                  <p> {step.status}</p>
                </div>
                <div className="flex w-full items-center justify-between border-b-[1px] border-[--bg-color1] py-[10px]">
                  <p className="text-xs">{t.assignedTo}</p>
                  <p>{step.assignedTo.map((i) => i.username + " ")}</p>
                </div>
                <div className="flex w-full items-center justify-between border-b-[1px] border-[--bg-color1] py-[10px]">
                  <p className="text-xs">{t.assignedTo}</p>
                  <p>{step.assignedTo.map((i) => i.username + " ")}</p>
                </div>

                <div className="flex w-full items-center justify-between border-b-[1px] border-[--bg-color1] py-[10px]">
                  <p className="text-xs">{t.comments}</p>
                  <div className="flex flex-col gap-2 py-2">
                    <div className="flex flex-col gap-2">
                      {step.comments.map((i) => (
                        <div key={i.id} className="">
                          <p className="text-sm">{i.user.username}</p>
                          <p>{i.message}</p>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => handlerAddComment(step)}
                      className="text-alertSuccess w-fit rounded-full bg-[#262c80] px-5 py-1 text-white"
                    >
                      {t.addComment}
                    </button>
                  </div>
                </div>

                <div className="flex w-full items-center justify-between border-b-[1px] border-[--bg-color1] py-[10px]">
                  <p className="text-xs">{t.dueDate}</p>
                  <p>{format(step.dueDate, "dd/MM/yyyy pp")}</p>
                </div>
                <div className="flex w-full items-center justify-between border-b-[1px] border-[--bg-color1] py-[10px]">
                  <p className="text-xs">{t.updatedAt}</p>
                  <p>{format(step.updatedAt, "dd/MM/yyyy pp")}</p>
                </div>

                <div className="flex w-full items-center justify-between border-b-[1px] border-[--bg-color1] py-[10px]">
                  <p className="text-xs">{t.actions}</p>
                  <div className="flex gap-3">
                    <button
                      className="w-fit rounded-[--buttonRadius] bg-[--secondary] px-1 py-1"
                      onClick={() => handlerUpdate(step)}
                    >
                      <Edit />
                    </button>

                    <button
                      onClick={() => onClickDelete(step.id)}
                      className="bg-alertErrorBg w-fit rounded-[--buttonRadius] px-1 py-1"
                    >
                      <Delete />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </ListSkeleton>
      </div>
    </div>
  );
}
