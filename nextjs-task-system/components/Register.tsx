import { useForm, SubmitHandler } from "react-hook-form";
import { Forward, Person } from "./Icons";
import { loadingStore, useTheme } from "@/store";
import { registerUser } from "@/libs/axios";
import Swal from "sweetalert2";
import { Dispatch, SetStateAction } from "react";
import { ViewState } from "@/app/page";

interface FormData {
  username: string;
  password: string;
}

interface RegisterProps {
  setView: Dispatch<SetStateAction<ViewState>>;
}

const Register: React.FC<RegisterProps> = ({ setView }) => {
  const { setLoading } = loadingStore((state) => state);
  const { t } = useTheme((state) => state);

  const { register, handleSubmit } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = async (formData) => {
    setLoading(true);
    try {
      await registerUser(formData.username, formData.password);
      setView("Login");
      Swal.fire({
        position: "center",
        icon: "success",
        title: t.userCreatedYouCanNowLogIn,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: t.invalidUsernamePassword,
      });
    }
    setLoading(false);
  };

  return (
    <div className="absolute left-0 top-0 flex size-full justify-center p-10 text-white">
      <div className="z-10 flex h-fit w-full max-w-4xl rounded-lg bg-[#a8a8a8]">
        <div className="flex w-full flex-col items-center p-10 md:w-1/2">
          <div className="m-3 flex w-fit space-x-2 rounded-lg bg-[#242222]">
            <button
              type="button"
              className="rounded-lg bg-yellow-500 px-4 py-2"
            >
              {t.register}
            </button>
            <button
              type="button"
              className="rounded-lg px-4 py-2"
              onClick={() => setView("Login")}
            >
              {t.login}
            </button>
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="m-8 flex w-full flex-col gap-4"
          >
            <input
              type="text"
              placeholder="username"
              required
              {...register("username")}
              className="w-full rounded-md bg-[var(--bg-color3)] p-3 focus:outline-none"
            />
            <input
              type="password"
              placeholder="Password"
              required
              {...register("password")}
              className="w-full rounded-md bg-[var(--bg-color3)] p-3 focus:outline-none"
            />
            <button className="flex w-full items-center justify-center rounded-lg bg-yellow-500 py-3 text-white">
              {t.continue}
              <Forward />
            </button>
          </form>
        </div>
        <div className="hidden w-1/2 flex-col items-center justify-center gap-10 rounded-lg  bg-black p-7 text-center md:flex">
          <h2 className="text-2xl font-bold">{t.welcomeBacktoTask}</h2>
          <p>{t.taskDescripction}</p>
          <Person />
        </div>
      </div>
    </div>
  );
};

export default Register;
