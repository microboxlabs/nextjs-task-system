"use client";
import { Search } from "./Icons";
import { useForm, SubmitHandler } from "react-hook-form";
import { Priority, Role, Status } from "@prisma/client";
import { useAuthStore, useTheme } from "@/store";

// Define types for the form data
interface FormData {
  assignedTo?: string;
  priority?: string;
  status?: string;
  order?: string;
}

interface FilterTasksProps {
  setFilter: (filter: string) => void;
}

export default function FilterTasks({ setFilter }: FilterTasksProps) {
  const { t } = useTheme((state) => state);
  const { role } = useAuthStore((state) => state);

  const {
    register,
    handleSubmit,
  } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = async (formData) => {
    let result = Object.entries(formData)
      .filter(([, value]) => value !== "")
      .map(([key, value]) => {
        return `${key}=${value}`;
      })
      .join("&");

    result = result.trim() !== "" ? result.replace("+", "\\%2B") : result;
    setFilter(result);
    return;
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex h-fit w-full flex-col items-center justify-between gap-[20px] rounded-md bg-[--bg-color3] px-[30px] py-[20px] xl:flex-row"
    >
      {role === Role.admin && (
        <div className="flex w-full flex-col items-start gap-1">
          <p className="text-xs">{t.users}</p>
          <input
            placeholder="--"
            {...register("assignedTo")}
            className="w-full rounded-md p-3 text-black focus:outline-none"
          />
        </div>
      )}

      <div className="flex w-full flex-col items-start gap-1">
        <p className="text-xs">{t.priority}</p>
        <select
          {...register("priority")}
          defaultValue=""
          className="w-full rounded-md p-3 text-black focus:outline-none"
        >
          <option value="">--</option>
          <option value={Priority.low}>{t.low}</option>
          <option value={Priority.medium}>{t.medium}</option>
          <option value={Priority.high}>{t.high}</option>
        </select>
      </div>
      <div className="flex w-full flex-col items-start gap-1">
        <p className="text-xs">{t.status}</p>
        <select
          {...register("status")}
          defaultValue=""
          className="w-full rounded-md p-3 text-black focus:outline-none"
        >
          <option value="">--</option>
          <option value={Status.pending}>{t.pending}</option>
          <option value={Status.inProgress}>{t.inProgress}</option>
          <option value={Status.completed}>{t.completed}</option>
        </select>
      </div>

      <div className="flex w-full flex-col items-start gap-1">
        <p className="text-xs">{t.sorbBy}</p>
        <select
          {...register("order")}
          defaultValue=""
          className="w-full rounded-md p-3 text-black focus:outline-none"
        >
          <option value="">--</option>
          <option value={"oldestCreated"}>{t.oldestCreated}</option>
          <option value={"mostRecentCreated"}>{t.mostRecentCreated}</option>
          <option value={"oldestExpirationDate"}>
            {t.oldestExpirationDate}
          </option>
          <option value={"mostRecentExpirationDate"}>
            {t.mostRecentExpirationDate}
          </option>
          <option value={"byPriority"}>{t.byPriority}</option>
        </select>
      </div>

      <div className="flex flex-col  items-center justify-between gap-[10px] pt-[20px] sm:flex-row">
        <button
          type="button"
          onClick={() => location.reload()}
          className="w-full rounded-sm bg-[--text-color] px-[20px] py-[13px] text-[--bg-color3] sm:w-fit"
        >
          {t.reset}
        </button>
        <div className="flex flex-col gap-[10px] rounded-sm bg-[--text-color]">
          <button className="flex w-full flex-row items-center justify-center gap-2 rounded-[--buttonRadius] bg-[--primary] px-[20px] py-[13px] text-[--bg-color3] sm:w-fit">
            <Search color="var(--bg-color3)" />
            <p>{t.search}</p>
          </button>
        </div>
      </div>
    </form>
  );
}
