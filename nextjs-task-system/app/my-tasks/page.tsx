import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
import { FetchUserTasks } from "../lib/fetchUserTasks";
import TaskManager from "../ui/tasks/TaskManager";

export default async function HomePage() {
  const cookieStore = cookies();
  const token = cookieStore.get("auth-token");
  if (!token?.value) {
    return <p>Error: No authentication token found.</p>;
  }

  const decodedToken = jwtDecode(token.value);
  const { id } = decodedToken;
  const tasks = await FetchUserTasks(id);

  return (
    <div className="min-h-screen bg-gray-50">
      <TaskManager initialTasks={tasks} />
    </div>
  );
}
