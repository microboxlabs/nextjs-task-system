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

interface User {
  id: string;
  username: string;
}

interface Comment {
  id: string;
  user: User;
  message: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  assignedTo: User[];
  dueDate: Date;
  comments: Comment[];
  updatedAt: Date;
}

export interface FetchResponse {
  totalItems: number;
  totalPages: number;
  data: Task[];
}

export default function TableTask() {
  const { t } = useTheme((state) => state);
  const limit = 10;
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [modalTask, setModalTask] = useState<boolean>(false);
  const [addComment, setAddComment] = useState<boolean>(false);
  const [taskFilter, setTaskFilter] = useState<string>("");

  const { role } = useAuthStore((state) => state);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };
  useEffect(() => {
    fetchData(currentPage);
  }, [taskFilter, currentPage]);

  const fetchData = async (page: number) => {
    setIsLoading(true);
    const resp: FetchResponse | null = await getAllTasks(`page=${page}&limit=${limit}&${taskFilter}`);
    if(resp && resp.totalItems) setTotalItems(resp.totalItems);
    if(resp && resp.totalPages) setTotalPages(resp.totalPages);
    if(resp && resp.data) setTasks(resp.data);
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
    }
  };
  const { register, handleSubmit, reset, watch } = useForm();

  const handlerUpdate = (task: Task) => {
    reset({
      ...task,
      dueDate: format(task.dueDate, "yyyy-MM-dd"),
    });
    setModalTask(true);
  };

  const handlerAddComment = (task: Task) => {
    reset(task);
    setAddComment(true);
  };

  return (
    <div className="flex flex-col gap-[20px] p-[30px] min-h-screen size-full">
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
        <p className="text-xl font-semibold md:text-[28px]">{t.tasks}</p>
        {role === Role.admin && (
          <button
            className="flex h-[50px] items-center rounded-md bg-[#262c80] px-6 text-white"
            onClick={async () => {
              await reset({
                id: "",
                title: "",
                description: "",
                priority: Priority.low,
                status: Status.pending,
                assignedTo: [],
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
      <FilterTasks setFilter={setTaskFilter} />
      <div>
        <ListSkeleton totalItems={tasks?.length} loading={isLoading}>
          <div className="hidden w-full 2xl:flex">
            <table className="my-[20px] w-full table-auto">
              <thead className="font-bold">
                <tr>
                  <th className="py-[15px] pl-[30px]">ID</th>
                  <th>{t.title}</th>
                  <th>{t.description}</th>
                  <th>{t.priority}</th>
                  <th>{t.status}</th>
                  <th>{t.assignedTo}</th>
                  <th>{t.comments}</th>
                  <th>{t.dueDate}</th>
                  <th>{t.actions}</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task.id} className="mb-[2px] rounded-md border-2 border-[--bg-color5] bg-[--bg-color3]">
                    <td className="pl-[30px]">{task.id}</td>
                    <td>{task.title}</td>
                    <td>{task.description}</td>
                    <td>{task.priority}</td>
                    <td>{task.status}</td>
                    <td>{task.assignedTo.map((user) => user.username).join(" ")}</td>
                    <td>
                      <div className="flex flex-col gap-2 py-2">
                        <div className="flex flex-col gap-2">
                          {task.comments.map((comment) => (
                            <div key={comment.id} className="mx-1 border border-[#797979] p-1">
                              <p className="text-sm">{comment.user.username}</p>
                              <p>{comment.message}</p>
                            </div>
                          ))}
                        </div>
                        <button
                          onClick={() => handlerAddComment(task)}
                          className="w-fit rounded-full bg-[#262c80] px-5 py-1 text-white"
                        >
                          {t.addComment}
                        </button>
                      </div>
                    </td>
                    <td>{format(task.dueDate, "dd/MM/yyyy pp")}</td>
                    <td>
                      <div className="flex gap-3 py-[5px]">
                        <button
                          className="hidden w-fit rounded-[--buttonRadius] bg-[#262c80] p-1 xl:flex"
                          onClick={() => handlerUpdate(task)}
                        >
                          <Edit />
                        </button>
                        <button
                          onClick={() => onClickDelete(task.id)}
                          className="hidden w-fit rounded-[--buttonRadius] bg-[#813535] p-1 xl:flex"
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
                <div className="flex w-full items-center justify-between border-b border-[--bg-color1] py-[10px]">
                  <p className="text-xs">ID</p>
                  <p>{step.id}</p>
                </div>
                <div className="flex w-full items-center justify-between border-b border-[--bg-color1] py-[10px]">
                  <p className="text-xs">{t.title}</p>
                  <p>{step.title}</p>
                </div>
                <div className="flex w-full items-center justify-between border-b border-[--bg-color1] py-[10px]">
                  <p className="text-xs">{t.description}</p>
                  <p> {step.description}</p>
                </div>
                <div className="flex w-full items-center justify-between border-b border-[--bg-color1] py-[10px]">
                  <p className="text-xs">{t.priority}</p>
                  <p> {step.priority}</p>
                </div>
                <div className="flex w-full items-center justify-between border-b border-[--bg-color1] py-[10px]">
                  <p className="text-xs">{t.descrstatusiption}</p>
                  <p> {step.status}</p>
                </div>
                <div className="flex w-full items-center justify-between border-b border-[--bg-color1] py-[10px]">
                  <p className="text-xs">{t.assignedTo}</p>
                  <p>{step.assignedTo.map((i) => i.username + " ")}</p>
                </div>
                <div className="flex w-full items-center justify-between border-b border-[--bg-color1] py-[10px]">
                  <p className="text-xs">{t.assignedTo}</p>
                  <p>{step.assignedTo.map((i) => i.username + " ")}</p>
                </div>

                <div className="flex w-full items-center justify-between border-b border-[--bg-color1] py-[10px]">
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
                      className="w-fit rounded-full bg-[#262c80] px-5 py-1 text-white"
                    >
                      {t.addComment}
                    </button>
                  </div>
                </div>

                <div className="flex w-full items-center justify-between border-b border-[--bg-color1] py-[10px]">
                  <p className="text-xs">{t.dueDate}</p>
                  <p>{format(step.dueDate, "dd/MM/yyyy pp")}</p>
                </div>
                <div className="flex w-full items-center justify-between border-b border-[--bg-color1] py-[10px]">
                  <p className="text-xs">{t.updatedAt}</p>
                  <p>{format(step.updatedAt, "dd/MM/yyyy pp")}</p>
                </div>

                <div className="flex w-full items-center justify-between border-b border-[--bg-color1] py-[10px]">
                  <p className="text-xs">{t.actions}</p>
                  <div className="flex gap-3 py-[5px]">
                        <button
                          className="hidden w-fit rounded-[--buttonRadius] bg-[#262c80] p-1 xl:flex"
                          onClick={() => handlerUpdate(step)}
                        >
                          <Edit />
                        </button>
                        <button
                          onClick={() => onClickDelete(step.id)}
                          className="hidden w-fit rounded-[--buttonRadius] bg-[#813535] p-1 xl:flex"
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
