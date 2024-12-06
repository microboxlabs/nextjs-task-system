import { loadingStore, useAuthStore, useTheme } from "@/store";
import { Back, Forward } from "./Icons";
import { updateTask } from "@/libs/axios";
import Swal from "sweetalert2";
import io from 'socket.io-client';

const socket = io();
interface AddCommentProps {
  setAddComment: (value: boolean) => void;
  register: any;
  handleSubmit: any;
  watch: any;
  fetchData: (currentPage: number) => Promise<void>;
  currentPage: number;
}

interface FormData {
  id: string;
  message: string;
}

export default function AddComment({
  setAddComment,
  register,
  handleSubmit,
  watch,
  fetchData,
  currentPage,
}: AddCommentProps) {
  const { setLoading } = loadingStore((state) => state);
  const { t } = useTheme((state) => state);


  const onSubmit = async (formData: FormData) => {
    setLoading(true);

    // Emit event to WebSocket
    socket?.emit('input-change', {
      assignedTo: watch("assignedTo").map((i:any) => i.id.toString() ),
      message: `${t.titleTaskCommentAdded} ${watch("title")}`,
    });

    try {
      await updateTask({
        id: watch("id").toString(),
        message: formData.message,
      });
      Swal.fire({
        position: "center",
        icon: "success",
        title: t.messageCreated,
        showConfirmButton: false,
      });
      setAddComment(false);
      await fetchData(currentPage);
    } catch (error) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: t.anErrorHasOccurred,
      });
    }
    setLoading(false);
  };

 

  return (
    <div className="absolute left-0 top-0 flex size-full justify-center p-10">
      <div
        className="absolute left-0 top-0 size-full bg-gray-900 opacity-60"
        onClick={() => setAddComment(false)}
      />
      <div className="z-10 flex h-fit w-full max-w-4xl flex-col items-center rounded-lg bg-[--bg-color3] p-10 text-center md:w-1/2">
        <button
          onClick={() => setAddComment(false)}
          className="my-6 flex items-center self-start"
        >
          <Back />
          {t.back}
        </button>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="m-8 flex w-full flex-col gap-4"
        >
          <h2 className="text-2xl font-bold">
            {`Añadir comentario a tarea ${watch("id")}`}
          </h2>
          <input className="hidden" {...register("id")} />
          <textarea
            placeholder="message"
            required={true}
            {...register("message")}
            className="w-full rounded-md bg-[--bg-color3] p-3 text-[--text-color] focus:outline-none"
          />
          <button className="flex w-full items-center justify-center rounded-lg bg-yellow-500 py-3 text-white">
            {t.continue} <Forward />
          </button>
        </form>
      </div>
    </div>
  );
}
