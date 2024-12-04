import { useForm } from "react-hook-form";
import { Forward, Person } from "./Icons";
import { loadingStore, useTheme } from "@/store";
import { registerUser } from "@/libs/axios"; 
import Swal from "sweetalert2";

export default function Register({ setView }) {
  const { setLoading } = loadingStore((state) => state);
  const { t } = useTheme((state) => state);

  const {
    register,
    handleSubmit
  } = useForm();

  const onSubmit = async (formData) => {
    setLoading(true);
    try {
      await registerUser(formData.username, formData.password);
      setView("Login");
      Swal.fire({
        position: "center",
        icon: "success",
        title: t.userCreatedYouCanNowLogIn,
        showConfirmButton: false
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: t.invalidUsernamePassword
      });
    }
    setLoading(false);
    return;
  };

  return (
    <div className="absolute top-0 left-0 h-full w-full flex justify-center p-10 text-white">
      <div className="w-full max-w-4xl rounded-lg bg-[#a8a8a8] flex z-10 h-fit">
        <div className="flex flex-col items-center w-full md:w-1/2 p-10">
          <div className="flex space-x-2 rounded-lg bg-[#242222]  w-fit m-3">
            <button
              type="button"
              className="bg-yellow-500 py-2 px-4 rounded-lg"
            >
              {t.register}
            </button>
            <button
              type="button"
              className="py-2 px-4 rounded-lg"
              onClick={() => setView("Login")}
            >
              {t.login}
            </button>
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4 w-full m-8"
          >
            <input
              type="username"
              placeholder="username"
              required={true}
              {...register("username")}
              className="w-full p-3 rounded-md focus:outline-none bg-[var(--bg-color3)] text-[var(--text-color)] placeholder-[var(--text-color)]"
            />
            <input
              type="password"
              placeholder="Password"
              required={true}
              {...register("password")}
              className="w-full p-3 rounded-md focus:outline-none bg-[var(--bg-color3)] text-[var(--text-color)] placeholder-[var(--text-color)]"
            />
            <button className="text-white w-full bg-yellow-500 py-3 rounded-lg flex items-center justify-center">
              {t.continue}<Forward />
            </button>
          </form>
        </div>
        <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-black  gap-10 rounded-lg p-7 text-center">
          <h2 className="text-2xl font-bold">{t.welcomeBacktoTask}</h2>
          <p>{t.taskDescripction}</p>
          <Person />
        </div>
      </div>
    </div>
  );
}