import { loadingStore, useAuthStore, useTheme } from "@/store";
import { AngleBotton, Back, Forward } from "./Icons";
import { createTask, getAllUsers, updateTask } from "@/libs/axios";
import { useEffect, useState } from "react";
import { Priority, Role, Status} from "@prisma/client";
import Swal from "sweetalert2";
import io, { Socket } from 'socket.io-client';
import { User } from "./TableUsers";

interface ModalTaskProps {
  fetchData: (page: number) => void;
  currentPage: number;
  setModalTask: (open: boolean) => void;
  register: any;
  handleSubmit: (data: any) => any;
  watch: (value: string) => any;
}

interface UserState {
  [key: string]: {
    checked: boolean;
    username: string;
  };
}

const socket = io();

const ModalTask: React.FC<ModalTaskProps> = ({
  fetchData,
  currentPage,
  setModalTask,
  register,
  handleSubmit,
  watch,
}) => {
  const { setLoading } = loadingStore((state) => state);
  const { t } = useTheme((state) => state);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [user, setUser] = useState<UserState>({});
  const [showUser, setShowUser] = useState(false);
  const { role } = useAuthStore((state) => state);

  useEffect(() => {
    (async () => {
      if (role === Role.admin) {
        const resp = await getAllUsers(`page=1&limit=1000`);
        if (resp && Array.isArray(resp.data)){
          setAllUsers(resp.data);
        }
       
        if (Array.isArray(watch("assignedTo"))) {
          setUser(
            watch("assignedTo").reduce(
              (a: UserState, v: User) => ({
                ...a,
                [v.id]: {
                  checked: true,
                  username: v.username,
                },
              }),
              {}
            )
          );
        }
      }
    })();
  }, [watch, role]);

  const onSubmit = async (formData: any) => {
    setLoading(true);
    socket?.emit("input-change", {
      assignedTo: Object.keys(user).filter((step) => user[step].checked),
      message: `${t.titleTaskCreatedUpdated} ${formData.title}`,
    });

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        dueDate: formData.dueDate,
        assignedTo: Object.keys(user).filter((step) => user[step].checked),
        priority: formData.priority,
        status: formData.status,
      };
      let response;
      if (formData.id === "") {
        response = await createTask(payload);
      } else {
        response = await updateTask({
          ...payload,
          id: watch("id").toString(),
        });
      }

      Swal.fire({
        position: "center",
        icon: "success",
        title: t.taskUpdatedCreated,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: t.anErrorHasOccurred,
      });
    }
    fetchData(currentPage);
    setModalTask(false);
    setLoading(false);
    return;
  };

  return (
    <div className="absolute left-0 top-0 flex size-full justify-center p-10">
      <div
        className="absolute left-0 top-0 size-full bg-gray-900 opacity-60"
        onClick={() => setModalTask(false)}
      />
      <div className="z-10 flex h-fit w-full max-w-4xl flex-col items-center rounded-lg bg-[--bg-color3] p-10 text-center md:w-1/2">
        <button
          onClick={() => setModalTask(false)}
          className="my-6 flex items-center self-start font-bold"
        >
          <Back />
          {t.back}
        </button>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="m-8 flex w-full flex-col gap-4 "
        >
          <h2 className="text-2xl font-bold ">
            {watch("id") === "" ? t.newTask : `${t.updateTask} ${watch("id")}`}
          </h2>
          <input className="hidden" {...register("id")} />
          <div className="flex flex-col items-start gap-1">
            <p className="text-xs">{t.title}</p>
            <input
              placeholder={t.title}
              readOnly={role !== Role.admin}
              required={true}
              {...register("title")}
              className="w-full rounded-md p-3 text-black"
            />
          </div>
          <div className="flex flex-col items-start gap-1">
            <p className="text-xs">{t.description}</p>
            <textarea
              placeholder={t.description}
              readOnly={role !== Role.admin}
              required={true}
              {...register("description")}
              className="w-full rounded-md p-3 text-black"
            />
          </div>
          <div className="flex flex-col items-start gap-1">
            <p className="text-xs">{t.dueDate}</p>
            <input
              type="date"
              placeholder={t.dueDate}
              required={true}
              readOnly={role !== Role.admin}
              {...register("dueDate")}
              className="w-full rounded-md p-3 text-black focus:outline-none"
            />
          </div>

          {role === Role.admin && (
            <div className="flex w-full flex-col items-start gap-1">
              <p className="text-xs">{t.users}</p>
              <div className="relative flex w-full flex-col gap-[10px]">
                <button
                  className="mb-[10px] flex h-[50px] w-full cursor-pointer items-center justify-between rounded-l border-DEFAULT border-[--inputsBorder] bg-white px-[18px] py-[20px] outline-none"
                  type="button"
                  onClick={() => setShowUser(!showUser)}
                >
                  <p className="max-w-[80%] truncate px-2 text-start text-black">
                    {Object.keys(user).map((step, i) =>
                      user[step].checked
                        ? user[step].username +
                          (Object.keys(user).length > i + 1 ? ", " : "")
                        : ""
                    )}
                  </p>
                  <AngleBotton />
                </button>
                {showUser ? (
                  <div
                    className="absolute top-[50px] flex max-h-[250px] w-full flex-col items-start gap-[20px] overflow-auto rounded-[10px] bg-white p-[20px] text-black shadow-md"
                    onMouseLeave={() => setShowUser(false)}
                  >
                    {allUsers.map((step, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={step.id.toString()}
                          onChange={(e) => {
                            setUser({
                              ...user,
                              [step.id]: {
                                checked: e.target.checked,
                                username: step.username,
                              },
                            });
                          }}
                          checked={user[step.id]?.checked ?? false}
                        />
                        <label htmlFor={step.id.toString()}>{step.username}</label>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          )}

          <div className="flex flex-col items-start gap-1">
            <p className="text-xs">{t.priority}</p>
            <select
              required={true}
              readOnly={role !== Role.admin}
              {...register("priority")}
              defaultValue={Priority.low}
              className="w-full rounded-md p-3 text-black focus:outline-none"
            >
              <option value={Priority.low}>{t.low}</option>
              <option value={Priority.medium}>{t.medium}</option>
              <option value={Priority.high}>{t.high}</option>
            </select>
          </div>
          <div className="flex flex-col items-start gap-1">
            <p className="text-xs">{t.status}</p>
            <select
              required={true}
              {...register("status")}
              defaultValue={Status.pending}
              className="w-full rounded-md p-3 text-black focus:outline-none"
            >
              <option value={Status.pending}>{t.pending}</option>
              <option value={Status.inProgress}>{t.inProgress}</option>
              <option value={Status.completed}>{t.completed}</option>
            </select>
          </div>

          <button className="flex w-full items-center justify-center rounded-lg bg-yellow-500 py-3 text-white">
            {t.continue}
            <Forward />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ModalTask;

