import { signIn } from "@/lib/auth";
import { Github } from "lucide-react";

export default function GithubOAuth() {
  return (
    <div className="space-y-4 ">
      <form
        action={async () => {
          "use server";
          await signIn("github");
        }}
      >
        <button className="flex w-full items-center justify-center rounded-md border border-transparent bg-gray-800 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:bg-gray-700 dark:hover:bg-gray-600">
          <Github className="mr-2 size-5" />
          Sign up with GitHub
        </button>
      </form>
    </div>
  );
}
