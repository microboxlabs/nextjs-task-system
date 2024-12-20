import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/authOptions";
import { CreateTask } from "./CreateTask";

export default async function CreateTaskPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <main className="p-2">
      <CreateTask />
    </main>
  );
}
