"use client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signIn } from "next-auth/react";



function Signin() {
  const { register, handleSubmit, formState: { errors }, } = useForm();
  const router = useRouter();
  const [error, setError] = useState(null)

  const onSubmit = handleSubmit(async (data) => {
    console.log(data)
    const res = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    console.log(res)
    if (res.error) {
      setError(res.error)
    } else {
      router.push('/')
      router.refresh()
    }
  })

  return (
    <div className="flex h-[calc(100vh-7rem)] items-center justify-center">
      <form onSubmit={onSubmit} className="w-10/12 lg:w-5/12">

        {error && (
          <p className="mb-2 rounded bg-red-500 p-3 text-lg text-white">{error}</p>
        )}

        <h1 className="mb-4 text-4xl font-bold text-slate-200">Login</h1>

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
          placeholder="******"
        />

        {errors.password && typeof errors.password.message === "string" && (
          <span className="text-xs text-red-500">
            {errors.password.message}
          </span>
        )}

        <button className="mt-2 w-full rounded-lg bg-blue-500 p-3 text-white">
          Login
        </button>
      </form>
    </div>
  )
}

export default Signin