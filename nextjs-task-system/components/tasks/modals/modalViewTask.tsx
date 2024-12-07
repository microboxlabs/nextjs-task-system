import { useEffect, useRef, useState } from "react";
import {
  Button,
  Datepicker,
  Label,
  Modal,
  Select,
  Textarea,
  TextInput,
} from "flowbite-react";
import {
  GroupsAndPriorities,
  RelationResponse,
  ResponseSelectAssigned,
  ResponseTaskGet,
  ResponseTaskGetWithoutArray,
  Task,
} from "@/types/tasks-types";
import { useTaskContext } from "@/context/TaskContext";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { updateTaskModalView } from "@/actions/tasks/task-actions";
import { BiTask } from "react-icons/bi";

import {
  MdAddTask,
  MdOutlineDescription,
  MdOutlinePriorityHigh,
} from "react-icons/md";

import { User } from "@/types/global-types";
import { useGlobalContext } from "@/context/GlobalContext";

interface props {
  setShowToast: React.Dispatch<
    React.SetStateAction<{
      show: boolean;
      message: string;
      icon: "alert" | "warning" | "success" | "";
    }>
  >;
  setTasksData: React.Dispatch<React.SetStateAction<ResponseTaskGet>>;
}

export default function ModalViewTask({ setTasksData, setShowToast }: props) {
  {
    /*Context to utilize*/
  }
  const userLogged: User = useGlobalContext();
  const { taskForModal, setTaskForModal, viewModal, setViewModal } =
    useTaskContext();

  {
    /*Variables to show data or show banners in case of a change*/
  }

  const [dataAssigned, setDataAssigned] =
    useState<ResponseSelectAssigned | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [formData, setFormData] = useState<Task & { typeOfAssigned: string }>({
    id: 0,
    title: "",
    description: "",
    user: null,
    group: null,
    dueDate: new Date(),
    typeOfAssigned: "",
    priority: { id: 0, name: "" },
    status: { id: 0, name: "" },
    comments: [],
    creationDate: new Date(),
  });

  {
    /*useffect to recieve the data for the form*/
  }
  useEffect(() => {
    if (taskForModal?.task?.id && taskForModal.task.id !== 0) {
      setFormData({
        title: taskForModal.task.title || "",
        description: taskForModal.task.description || "",
        priority: taskForModal.task.priority || "",
        user: taskForModal.task.user || null,
        dueDate: taskForModal.task.dueDate,
        group: taskForModal.task.group || null,
        status: taskForModal.task.status || null,
        creationDate: taskForModal.task.creationDate,
        id: taskForModal.task.id || 0,
        comments: taskForModal.task.comments,
        typeOfAssigned: taskForModal.task.user
          ? "person"
          : taskForModal.task.group
            ? "group"
            : "",
      });
    }
  }, [taskForModal]);

  useEffect(() => {
    const fetchData = async () => {
      if (!viewModal) return;

      try {
        const url = process.env.NEXT_PUBLIC_URL_PAGE + "/api/tasks/getselects";
        const response = await fetch(url, {
          method: "GET",
          credentials: "include",
        });
        const data: ResponseSelectAssigned = await response.json();
        setDataAssigned(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [viewModal]);

  {
    /*Values for comment button and input */
  }
  const [commentInput, setCommentInput] = useState<string>("");
  const [showCommentButton, setShowCommentButton] = useState<boolean>();

  const handleTextCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCommentInput(e.target.value);
  };

  const handleCommentFocus = () => {
    setShowCommentButton(true);
  };

  const handleCommentBlur = () => {
    setTimeout(() => setShowCommentButton(false), 200);
  };

  {
    /* Values and functions for description button */
  }

  const [isChanged, setIsChanged] = useState(false);
  const [showSaveButton, setShowSaveButton] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [originalDescription, setOriginalDescription] = useState<string>("");

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      description: e.target.value,
    });
    setIsChanged(true);
    setShowSaveButton(true);
  };

  const handleFocus = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    if (isEditing) {
      return;
    }
  };

  const handleCancel = () => {
    setFormData({
      ...formData,
      description: originalDescription,
    });

    setIsChanged(false);
    setShowSaveButton(false);
    setIsEditing(false);
  };

  {
    /* change state for selects*/
  }

  const [selectsChanged, setSelectsChanged] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    if (dataAssigned?.data) {
      let newStatus: RelationResponse | null = null;
      let newPriority: RelationResponse | null = null;

      if (name === "priority" && dataAssigned.data.priorities) {
        newPriority =
          (dataAssigned.data?.priorities.find(
            (priority: GroupsAndPriorities) => priority.id === parseInt(value),
          ) as RelationResponse) || null;
      } else if (name === "status" && dataAssigned.data.status) {
        newStatus =
          (dataAssigned.data?.status.find(
            (status: GroupsAndPriorities) => status.id === parseInt(value),
          ) as RelationResponse) || null;
      }

      // Compara los valores actuales con los nuevos antes de actualizar el estado
      setFormData((prevState) => {
        const shouldSetSelectsChanged =
          (newStatus && prevState.status.id !== newStatus.id) ||
          (newPriority && prevState.priority.id !== newPriority.id);

        if (shouldSetSelectsChanged) {
          setSelectsChanged(true);
        }

        // Retorna el nuevo estado actualizado
        return {
          ...prevState,
          ...(newStatus && { status: newStatus }),
          ...(newPriority && { priority: newPriority }),
        };
      });
    } else {
      console.warn("dataAssigned or dataAssigned.data is undefined");
    }
  };

  {
    /* Loading state to let next process the context data */
  }
  if (taskForModal.task.id === 0) {
    return (
      <Modal
        show={viewModal}
        size="lg"
        onClose={() => setViewModal(false)}
        popup
      >
        <Modal.Header>Edit Task</Modal.Header>
        <Modal.Body>
          {taskForModal.task.id === 0 && (
            <div className="space-y-6">
              <div className="h-8 animate-pulse rounded-md bg-gray-300"></div>
              <div className="h-8 animate-pulse rounded-md bg-gray-300"></div>
              <div className="h-20 animate-pulse rounded-md bg-gray-300"></div>
              <div className="h-10 animate-pulse rounded-md bg-gray-300"></div>
            </div>
          )}
        </Modal.Body>
      </Modal>
    );
  }

  {
    /* Modal in case of an error*/
  }
  if (dataAssigned?.status != 200 && !loading) {
    return (
      <Modal
        className="min-h-screen"
        show={viewModal}
        size="md"
        onClose={() => setViewModal(false)}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 size-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              There was an error loading the options! please try again later.
            </h3>
          </div>
        </Modal.Body>
      </Modal>
    );
  }

  return (
    <>
      <Modal
        className="min-h-screen"
        show={viewModal}
        size="lg"
        onClose={() => {
          setViewModal(false);
          setTaskForModal({
            task: {
              dueDate: "",
              id: 0,
              priority: { id: 0, name: "" },
              status: { id: 0, name: "" },
              title: "",
              group: { id: 0, name: "" },
              user: { id: 0, name: "" },
              description: "",
              comments: [],
              creationDate: "",
            },
          });
        }}
        popup
      >
        <Modal.Header>
          <div className="flex  items-center  gap-2">
            <BiTask className="justify-center" />
            {formData.title}
          </div>
        </Modal.Header>

        <Modal.Body>
          <div className="space-y-6">
            <form
              action={async () => {
                const response: ResponseTaskGetWithoutArray =
                  await updateTaskModalView(formData, commentInput);
                if (response.status === 200) {
                  setShowToast({
                    message: response.message,
                    icon: response.status == 200 ? "success" : "warning",
                    show: true,
                  });
                  //update the original array of task to make the order again
                  setTasksData((prevData) => ({
                    ...prevData, // Copy the previous state
                    data: prevData?.data.map((task: Task) =>
                      task.id === response.data.id
                        ? {
                            ...task,
                            id: response.data.id,
                            dueDate: response.data.dueDate,
                            status: response.data.status,
                            description: response.data.description,
                            group: response.data.group,
                            priority: response.data.priority,
                            title: response.data.title,
                            user: response.data.user,
                            comments: response.data.comments
                              ? [...response.data.comments]
                              : [],
                          }
                        : task,
                    ),
                  }));

                  //this view resets after a submit so setTaskForModal helps to provide the real data
                  setTaskForModal({ task: response.data });

                  //resets the state of the inputs and buttons for editing
                  setCommentInput("");
                  setShowSaveButton(false);
                  setIsChanged(false);
                  setIsEditing(false);
                  setSelectsChanged(false);
                }
              }}
            >
              <div className="mb-2">
                {/* Priority and status */}

                <div>
                  <div className="mb-2 flex  items-center  gap-2">
                    <MdAddTask />
                    <Label htmlFor="Status" value="Status" />
                  </div>
                  {loading ? (
                    <div className="h-8 animate-pulse rounded-md bg-gray-300"></div>
                  ) : (
                    <Select
                      id="Status"
                      name="status"
                      value={formData.status.id}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select a value</option>
                      {dataAssigned?.data?.status?.map((status, index) => (
                        <option key={index} value={status.id}>
                          {status.name}
                        </option>
                      ))}
                    </Select>
                  )}
                </div>
                <div className="mt-2">
                  <div className="mb-2 flex items-center gap-2">
                    <MdOutlinePriorityHigh />
                    <Label htmlFor="Priority" value="Priority" />
                  </div>

                  {loading ? (
                    <div className="h-8 animate-pulse rounded-md bg-gray-300"></div>
                  ) : userLogged.rol === 1 ? (
                    <Select
                      id="Priority"
                      name="priority"
                      value={formData.priority.id}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select a value</option>
                      {dataAssigned?.data?.priorities?.map(
                        (priority, index) => (
                          <option key={index} value={priority.id}>
                            {priority.name}
                          </option>
                        ),
                      )}
                    </Select>
                  ) : (
                    <TextInput
                      type="text"
                      value={formData.priority.name || ""}
                      readOnly
                      className="h-8 w-full rounded-md border border-gray-300 bg-gray-100"
                    />
                  )}
                </div>

                {selectsChanged && (
                  <button
                    type="submit"
                    className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-white"
                  >
                    Update
                  </button>
                )}
                {/* Description */}
                <div className="relative col-span-2 mt-12">
                  <div className="mb-2 flex items-center gap-2">
                    <MdOutlineDescription />
                    <Label htmlFor="description" value="Description" />
                  </div>
                  {loading ? (
                    <div className="h-20 animate-pulse rounded-md bg-gray-300"></div>
                  ) : (
                    <>
                      <Textarea
                        name="description"
                        value={formData.description}
                        onChange={handleTextChange}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        placeholder="Describe your task"
                        required
                        className="w-full"
                      />
                      {showSaveButton && (
                        <div className="right-0 mt-2 flex">
                          <Button
                            type="submit"
                            disabled={!isChanged}
                            className="bg-blue-500 text-white disabled:bg-gray-300"
                            size="sm"
                          >
                            Guardar
                          </Button>
                          <Button
                            type="button"
                            className="ml-2 bg-gray-500 text-white disabled:bg-gray-300"
                            size="sm"
                            onClick={handleCancel}
                          >
                            Cancelar
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Comments */}
                <div className="relative col-span-2 mt-10">
                  <div className="mb-2 block">
                    <Label htmlFor="small" />
                  </div>
                  <TextInput
                    value={commentInput}
                    onChange={(e) => handleTextCommentChange(e)}
                    onFocus={handleCommentFocus}
                    onBlur={handleCommentBlur}
                    id="small"
                    type="text"
                    sizing="sm"
                    placeholder="Write a comment"
                  />
                </div>
                {showCommentButton && (
                  <div className=" right-0 mt-2">
                    <Button
                      size="sm"
                      type="submit"
                      disabled={commentInput?.trim() == ""}
                      className="bg-blue-500 text-white disabled:bg-gray-300"
                    >
                      Guardar
                    </Button>
                  </div>
                )}
                {(formData.comments ?? []).map((comment, index) => (
                  <div
                    key={index}
                    className="col-span-2 mt-4 rounded-md border bg-gray-50 p-2"
                  >
                    <div className="mb-2">
                      <p className="text-sm font-semibold text-gray-700">
                        {comment.user.name}
                      </p>
                    </div>
                    <p className="text-sm text-gray-600">{comment.content}</p>
                  </div>
                ))}
              </div>
            </form>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
