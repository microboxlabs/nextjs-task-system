import { getServerSession } from "next-auth";
import TaskBoard from "./components/TaskBoard";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/authOptions";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <main className="p-2">
      <TaskBoard />
    </main>
  );
}
