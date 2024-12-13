import { TaskDetails } from "@/components/TaskDetails";
import { Task } from "@/types";
import { apiRequest } from "@/utils/apiUtils";
import { notFound } from "next/navigation";

export default async function TaskDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  let task: Task | null = null;

  try {
    const result = await apiRequest<Task>({
      url: `/api/tasks/${id}`,
      method: "GET",
    });

    task = result;
  } catch (error) {
    notFound();
  }

  if (!task) {
    notFound();
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center p-2 md:p-4">
      <TaskDetails task={task} />
    </div>
  );
}
