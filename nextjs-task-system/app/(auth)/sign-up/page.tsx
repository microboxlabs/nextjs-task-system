"use client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

function Signup() {

  const { register, handleSubmit, formState: { errors }, } = useForm();
  const router = useRouter();

  const onSubmit = handleSubmit(async (data) => {
    if (data.password !== data.confirmPassword) {
      return alert("Passwords do not match");
    }

    const res = await fetch("/api/users", {
      method: "POST",
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        password: data.password,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      router.push("/sign-in");
    }
  })

  return (
    <div className="flex h-[calc(100vh-7rem)] items-center justify-center">
      <form
        onSubmit={onSubmit}
        className="w-10/12 lg:w-5/12"
        method="POST"
      >
        <h1 className="mb-4 text-4xl font-bold ">Register</h1>

        <label htmlFor="name" className="mb-2 block text-sm text-slate-500">
          name:
        </label>
        <input
          type="text"
          {...register("name", {
            required: {
              value: true,
              message: "name is required",
            },
          })}
          className="mb-2 block w-full rounded bg-slate-900 p-3 text-slate-300"
          placeholder="yourUser123"
        />

        {errors.name && typeof errors.name.message === "string" && (
          <span className="text-xs text-red-500">
            {errors.name.message}
          </span>
        )}

        <label htmlFor="email" className="mb-2 block text-sm text-slate-500">
          Email:
        </label>
        <input
          type="email"
          {...register("email", {
            required: {
              value: true,
              message: "Email is required",
            },
          })}
          className="mb-2 block w-full rounded bg-slate-900 p-3 text-slate-300"
          placeholder="user@email.com"
        />
        {errors.email && typeof errors.email.message === "string" && (
          <span className="text-xs text-red-500">{errors.email.message}</span>
        )}

        <label htmlFor="password" className="mb-2 block text-sm text-slate-500">
          Password:
        </label>
        <input
          type="password"
          {...register("password", {
            required: {
              value: true,
              message: "Password is required",
            },
          })}
          className="mb-2 block w-full rounded bg-slate-900 p-3 text-slate-300"
          placeholder="********"
        />
        {errors.password && typeof errors.password.message === "string" && (
          <span className="text-sm text-red-500">
            {errors.password.message}
          </span>
        )}

        <label
          htmlFor="confirmPassword"
          className="mb-2 block text-sm text-slate-500"
        >
          Confirm Password:
        </label>
        <input
          type="password"
          {...register("confirmPassword", {
            required: {
              value: true,
              message: "Confirm Password is required",
            },
          })}
          className="mb-2 block w-full rounded bg-slate-900 p-3 text-slate-300"
          placeholder="********"
        />
        {errors.confirmPassword && typeof errors.confirmPassword.message === "string" && (
          <span className="text-sm text-red-500">
            {errors.confirmPassword.message}
          </span>
        )}

        <button className="mt-2 w-full rounded-lg bg-blue-500 p-3 text-white">
          Register
        </button>
      </form>
    </div>
  )
}

export default Signup