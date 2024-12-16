import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/authOptions";
import { CreateGroup } from "./CreateGroup";

export default async function CreateGroupPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <main className="p-2">
      <CreateGroup />
    </main>
  );
}
