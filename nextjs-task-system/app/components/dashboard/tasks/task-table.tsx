"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { TaskPriorityValues, TaskStatusValues } from "@/db/schema";
import { Trash, Edit, Eye } from "lucide-react";
import { useTaskContext } from "@/contexts/TaskContext";
import TaskDelete from "./task-delete";
import TaskEdit from "./task-edit";
import TaskDetails from "./task-details";
import { useState } from "react";
import { TaskT } from "@/db/type";
import { formatDate } from "@/lib/utils";
import { useUserContext } from "@/contexts/UserContext";
import TaskAssign from "./task-assign";
import { Input } from "../../ui/input";
import { NewTaskModal } from "./task-create";

type ActiveModal = "edit" | "delete" | "assign" | "details" | null;
export function TaskTable() {
  const { isAdmin } = useUserContext();
  const { tasks, updateTaskPriority, updateTaskStatus } = useTaskContext();
  const [openModal, setOpenModal] = useState<ActiveModal>(null);
  const [currentTask, setCurrentTask] = useState<TaskT | null>(null);

  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    search: "",
  });

  function openDelete(task: TaskT) {
    setCurrentTask(task);
    setOpenModal("delete");
  }

  function openAssign(task: TaskT) {
    setCurrentTask(task);
    setOpenModal("assign");
  }

  function openDetails(task: TaskT) {
    setCurrentTask(task);
    setOpenModal("details");
  }

  function openEdit(task: TaskT) {
    setCurrentTask(task);
    setOpenModal("edit");
  }

  function closeModal() {
    setOpenModal(null);
  }

  const filteredTasks = tasks.filter((task) => {
    const matchesStatus =
      filters.status === "all" ||
      !filters.status ||
      task.status === filters.status;
    const matchesPriority =
      filters.priority === "all" ||
      !filters.priority ||
      task.priority === filters.priority;
    const matchesSearch =
      !filters.search ||
      task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      (task.description &&
        task.description.toLowerCase().includes(filters.search.toLowerCase()));

    return matchesStatus && matchesPriority && matchesSearch;
  });

  return (
    <>
      {/* Filter Inputs */}
      <div className="mb-4 flex flex-col gap-4 md:flex-row ">
        {/* Filter by Status */}
        <Select
          onValueChange={(value) => setFilters({ ...filters, status: value })}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {Object.keys(TaskStatusValues).map((status) => (
              <SelectItem key={status} value={status}>
                {status.toLowerCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Filter by Priority */}
        <Select
          onValueChange={(value) => setFilters({ ...filters, priority: value })}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Filter by Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {Object.keys(TaskPriorityValues).map((priority) => (
              <SelectItem key={priority} value={priority}>
                {priority.toLowerCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Search Input */}
        <Input
          type="text"
          placeholder="Search title/description"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="w-[250px] rounded border px-2 py-1"
        />
        <div className="flex">
          <NewTaskModal />
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell className="font-medium">{task.title}</TableCell>
                <TableCell>{formatDate(task.dueDate)}</TableCell>
                <TableCell>
                  {isAdmin ? (
                    <Select
                      defaultValue={task.priority}
                      onValueChange={(value) =>
                        updateTaskPriority(value, task.id)
                      }
                    >
                      <SelectTrigger className="w-[100px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(TaskPriorityValues).map(
                          (priorityValue) => {
                            return (
                              <SelectItem
                                key={`${task.id}-status-${priorityValue}`}
                                value={priorityValue}
                              >
                                {priorityValue.toLocaleLowerCase()}
                              </SelectItem>
                            );
                          },
                        )}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge>{task.priority}</Badge>
                  )}
                </TableCell>
                <TableCell>
                  {isAdmin ? (
                    <Select
                      defaultValue={task.status}
                      onValueChange={(value) =>
                        updateTaskStatus(value, task.id)
                      }
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(TaskStatusValues).map((statusValue) => {
                          return (
                            <SelectItem
                              key={`${task.id}-status-${statusValue}`}
                              value={statusValue}
                              className="capitalize"
                            >
                              {statusValue.toLowerCase()}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge>{task.status}</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    disabled={!isAdmin}
                    variant="ghost"
                    onClick={() => openAssign(task)}
                  >
                    {(task.assignedToUserId &&
                      task.assignedUser &&
                      task.assignedUser.name) ||
                      (task.assignedToGroupId &&
                        task.assignedGroup &&
                        task.assignedGroup.name) ||
                      "Unassigned"}
                  </Button>
                </TableCell>
                <TableCell className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => openDetails(task)}
                  >
                    <Eye />
                  </Button>
                  {isAdmin && (
                    <>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => openEdit(task)}
                      >
                        <Edit />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => openDelete(task)}
                      >
                        <Trash />
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <TaskEdit
        task={currentTask}
        open={openModal === "edit"}
        onClose={closeModal}
      />
      <TaskDelete
        task={currentTask}
        open={openModal === "delete"}
        onClose={closeModal}
      />
      <TaskAssign
        task={currentTask}
        open={openModal === "assign"}
        onClose={closeModal}
      />
      <TaskDetails
        // use taskId to find the task dynamically inside the taskContext
        // and make sure it rerenders the task comments on change
        taskId={currentTask?.id}
        open={openModal === "details"}
        onClose={closeModal}
      />
    </>
  );
}
