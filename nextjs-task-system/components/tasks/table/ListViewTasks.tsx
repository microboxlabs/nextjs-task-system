import { ResponseTaskGet, Task } from "@/types/tasks-types";
import { Button, Table } from "flowbite-react";
import ModalUpdateTask from "../modals/modalUpdateTask";
import { useTaskContext } from "@/context/TaskContext";
import { ModalDeleteTask } from "../modals/modalDeleteTask";
import ModalViewTask from "../modals/modalViewTask";
import { useGlobalContext } from "@/context/GlobalContext";
import { User } from "@/types/global-types";

interface Props {
  tasks: Task[];
  setTasksData: React.Dispatch<React.SetStateAction<ResponseTaskGet>>;
  setShowToast: React.Dispatch<
    React.SetStateAction<{
      show: boolean;
      message: string;
      icon: "alert" | "warning" | "success" | "";
    }>
  >;
}

export default function ListViewTasks({
  tasks,
  setShowToast,
  setTasksData,
}: Props) {
  const userLogged: User = useGlobalContext();

  const {
    setTaskForModal,
    setShowModal,
    setIdForDelete,
    setShowDeleteModal,
    setViewModal,
  } = useTaskContext();

  const handleEditClick = (task: Task) => {
    setTaskForModal({ task: task });
    setShowModal(true);
  };

  const handleDeleteClick = (id: number) => {
    setIdForDelete(id);
    setShowDeleteModal(true);
  };

  const handleTableClick = (e: React.MouseEvent, task: Task) => {
    setTaskForModal({ task: task });
    setViewModal(true);
  };

  const filteredByUser = tasks.filter(
    (task: Task) =>
      task.group == null &&
      (task.status.name.toLowerCase() === "pending" ||
        task.status.name.toLowerCase() === "in progress" ||
        task.status.name.toLowerCase() === "completed") &&
      (userLogged.rol === 1 || task.user?.id === userLogged.userId),
  );

  const filteredByGroup = tasks.filter(
    (task: Task) =>
      task.group != null &&
      (task.status.name.toLowerCase() === "pending" ||
        task.status.name.toLowerCase() === "in progress" ||
        task.status.name.toLowerCase() === "completed") &&
      (userLogged.rol === 1 ||
        task.user?.id === userLogged.userId ||
        task.group?.id === userLogged.groupId),
  );

  return (
    <div className=" p-4">
      <div className="mt-4 overflow-x-auto">
        <h2>Tasks by User</h2>
        <Table className=" min-w-full">
          <colgroup>
            <col style={{ width: "20%" }} />
            <col style={{ width: "20%" }} />
            <col style={{ width: "20%" }} />
            <col style={{ width: "20%" }} />
            <col style={{ width: "20%" }} />
          </colgroup>
          <Table.Head>
            <Table.HeadCell>Task</Table.HeadCell>
            <Table.HeadCell>User</Table.HeadCell>
            <Table.HeadCell>Creation Date</Table.HeadCell>
            <Table.HeadCell>Due Date</Table.HeadCell>
            <Table.HeadCell>Status</Table.HeadCell>
            <Table.HeadCell>Priority</Table.HeadCell>
            {userLogged.rol === 1 && (
              <>
                <Table.HeadCell>Edit</Table.HeadCell>
                <Table.HeadCell>Delete</Table.HeadCell>
              </>
            )}
          </Table.Head>
          <Table.Body className="divide-y">
            {filteredByUser.map((task, index) => (
              <Table.Row
                key={`person-${index}`}
                className="bg-white dark:border-gray-700 dark:bg-gray-800"
              >
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  <Button onClick={(e) => handleTableClick(e, task)}>
                    {task.title}
                  </Button>
                </Table.Cell>
                <Table.Cell>{task.user?.name}</Table.Cell>
                <Table.Cell>
                  {new Date(task.creationDate).toISOString().split("T")[0]}
                </Table.Cell>
                <Table.Cell>
                  {new Date(task.dueDate).toISOString().split("T")[0]}
                </Table.Cell>
                <Table.Cell>{task.status.name}</Table.Cell>
                <Table.Cell>{task.priority.name}</Table.Cell>
                {userLogged.rol === 1 && (
                  <>
                    <Table.Cell>
                      <button
                        onClick={() => handleEditClick(task)}
                        className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
                      >
                        Edit
                      </button>
                    </Table.Cell>
                    <Table.Cell>
                      <button
                        onClick={() => handleDeleteClick(task.id)}
                        className="font-medium text-red-600 hover:underline dark:text-red-500"
                      >
                        Delete
                      </button>
                    </Table.Cell>
                  </>
                )}
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>

      <div className="mt-4 overflow-x-auto">
        <h2>Tasks by Group</h2>
        <Table className="min-w-full">
          <colgroup>
            <col style={{ width: "20%" }} />
            <col style={{ width: "20%" }} />
            <col style={{ width: "20%" }} />
            <col style={{ width: "20%" }} />
            <col style={{ width: "20%" }} />
          </colgroup>
          <Table.Head>
            <Table.HeadCell>Task</Table.HeadCell>
            <Table.HeadCell>Group</Table.HeadCell>
            <Table.HeadCell>Creation Date</Table.HeadCell>
            <Table.HeadCell>Due Date</Table.HeadCell>
            <Table.HeadCell>Status</Table.HeadCell>
            <Table.HeadCell>Priority</Table.HeadCell>
            {userLogged.rol === 1 && (
              <>
                <Table.HeadCell>Edit</Table.HeadCell>
                <Table.HeadCell>Delete</Table.HeadCell>
              </>
            )}
          </Table.Head>
          <Table.Body className="divide-y">
            {filteredByGroup.map((task, index) => (
              <Table.Row
                key={`group-${index}`}
                className="bg-white dark:border-gray-700 dark:bg-gray-800"
              >
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  <Button onClick={(e) => handleTableClick(e, task)}>
                    {task.title}
                  </Button>
                </Table.Cell>
                <Table.Cell>{task.group?.name}</Table.Cell>
                <Table.Cell>
                  {new Date(task.creationDate).toISOString().split("T")[0]}
                </Table.Cell>
                <Table.Cell>
                  {new Date(task.dueDate).toISOString().split("T")[0]}
                </Table.Cell>
                <Table.Cell>{task.status?.name}</Table.Cell>
                <Table.Cell>{task.priority?.name}</Table.Cell>
                {userLogged.rol === 1 && (
                  <>
                    <Table.Cell>
                      <button
                        onClick={() => handleEditClick(task)}
                        className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
                      >
                        Edit
                      </button>
                    </Table.Cell>
                    <Table.Cell>
                      <button
                        onClick={() => handleDeleteClick(task.id)}
                        className="font-medium text-red-600 hover:underline dark:text-red-500"
                      >
                        Delete
                      </button>
                    </Table.Cell>
                  </>
                )}
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
      <ModalUpdateTask
        setShowToast={setShowToast}
        setTasksData={setTasksData}
      />
      <ModalDeleteTask
        setShowToast={setShowToast}
        setTasksData={setTasksData}
      />
      <ModalViewTask setTasksData={setTasksData} setShowToast={setShowToast} />
    </div>
  );
}
