import { auth } from "./lib/auth";
import OAuth from "./components/auth/oauth";
import { redirect } from "next/navigation";
export default async function Home() {
  const session = await auth();
  if (session) redirect("/dashboard");
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="absolute right-5 top-5"></div>
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-md dark:bg-gray-800">
        <div className="text-center">
          <h1 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            Sign up for TaskMaster
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Start managing your tasks efficiently
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <OAuth />
        </div>
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            By signing up, you agree to our{" "}
            <a
              href="#"
              className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="#"
              className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
