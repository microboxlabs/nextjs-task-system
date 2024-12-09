import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
import { FetchUserTasks } from "../lib/fetchUserTasks";
import TaskManager from "../ui/tasks/TaskManager";
import { groupUsers } from "../lib/data";

export default async function HomePage() {
  const cookieStore = cookies();
  const token = cookieStore.get("auth-token");
  if (!token?.value) {
    return <p>Error: No authentication token found.</p>;
  }

  const decodedToken = jwtDecode<{ id: string }>(token.value);
  const { id: userId } = decodedToken;

  const tasks = await FetchUserTasks(userId);

  const userGroups = groupUsers.filter((group) =>
    group.userIds.includes(userId),
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <TaskManager
        initialTasks={tasks}
        currentUser={userId}
        userGroups={userGroups.map((g) => g.id)}
      />
    </div>
  );
}
