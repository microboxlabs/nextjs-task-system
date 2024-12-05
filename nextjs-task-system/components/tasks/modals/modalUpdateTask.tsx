import { useEffect, useState } from "react";
import { Button, Label, Modal, Select, Textarea, TextInput } from "flowbite-react";
import { relationResponse, ResponseSelectAssigned, ResponseTaskGet, Task } from "@/types/tasks-types";
import { useTaskContext } from "@/context/TaskContext";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { updateTask } from "@/actions/tasks/task-actions";

interface props {
    setShowToast: React.Dispatch<React.SetStateAction<{ show: boolean; message: string; icon: 'alert' | 'warning' | 'success' | '' }>>;
    setTasksData: React.Dispatch<React.SetStateAction<ResponseTaskGet>>;
}

export default function ModalUpdateTask({ setShowToast, setTasksData }: props) {
    const { updateModal, setUpdateModal, showModal, setShowModal } = useTaskContext();

    const [dataAssigned, setDataAssigned] = useState<ResponseSelectAssigned | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [formData, setFormData] = useState<Task & { typeOfAssigned: string }>({
        id: 0,
        title: "",
        description: "",
        user: null,
        group: null,
        dueDate: new Date(),
        typeOfAssigned:"",
        priority: { id: 0, name: "" },
        status: { id: 0, name: "" },
    });

    useEffect(() => {
        if (updateModal?.task?.id && updateModal.task.id !== 0) {
  
            setFormData({
                title: updateModal.task.title || "",
                description: updateModal.task.description || "",
                priority: updateModal.task.priority || "",
                user: updateModal.task.user || null,
                group: updateModal.task.group || null,
                status: updateModal.task.status || null,
                id: updateModal.task.id || 0,
                dueDate: updateModal.task.dueDate,
                typeOfAssigned:updateModal.task.user ? "person" : updateModal.task.group ? "group" : ""

            });
    
        }
    }, [updateModal]);


    useEffect(() => {
        const fetchData = async () => {
            if (!showModal ) return;

            try {
                const url = process.env.NEXT_PUBLIC_URL_PAGE + "/api/tasks/getselects";
                const response = await fetch(url, { method: "GET", credentials: "include" });
                const data: ResponseSelectAssigned = await response.json();
                setDataAssigned(data);

            } catch (error) {
                console.error("Error fetching data:", error);

            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [showModal]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
      ) => {
        const { name, value } = e.target;
        if (dataAssigned?.data) {
          if (name === "user" && dataAssigned.data.users) {
            setFormData((prevState) => ({
              ...prevState,
              [name]: dataAssigned.data?.users.find(
                (person: relationResponse) => person.id === parseInt(value)
              ) || null,
            }));
          } else if (name === "group" && dataAssigned.data.groups) {
            setFormData((prevState) => ({
              ...prevState,
              [name]: dataAssigned.data?.groups.find(
                (group: relationResponse) => group.id === parseInt(value)
              ) || null,
            }));
          } else{
            setFormData((prevState) => ({
                ...prevState,
                [name]: value
              }));
          }
          
        } else {
          console.warn("dataAssigned or dataAssigned.data is undefined");
        }
      };

    {/* Loading state to let next process the context data */ }
    if (updateModal.task.id === 0) {
        return (
            <Modal show={showModal} size="lg" onClose={() => setShowModal(false)} popup>
                <Modal.Header>Edit Task</Modal.Header>
                <Modal.Body>
                    {updateModal.task.id === 0 && (
                        <div className="space-y-6">
                            <div className="bg-gray-300 h-8 rounded-md animate-pulse"></div>
                            <div className="bg-gray-300 h-8 rounded-md animate-pulse"></div>
                            <div className="bg-gray-300 h-20 rounded-md animate-pulse"></div>
                            <div className="bg-gray-300 h-10 rounded-md animate-pulse"></div>
                        </div>
                    )}
                </Modal.Body>
            </Modal>
        );
    }



    {/* Modal in case of an error*/ }
    if (dataAssigned?.status != 200 && !loading) {
        return (
            <Modal className="min-h-screen" show={showModal} size="md" onClose={() => setShowModal(false)} popup>
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
        )
    }
    return (
        <Modal className="min-h-screen" show={showModal} size="lg" onClose={() => {
            setShowModal(false);
            setUpdateModal({
                task: {
                    dueDate: "", id: 0, priority: { id: 0, name: "" }, status: { id: 0, name: "" },
                    title: "", group: { id: 0, name: "" }, user: { id: 0, name: "" }, description: ""
                }
            });
        }} popup>
            <Modal.Header>Edit Task</Modal.Header>
            <Modal.Body>
                <div className="space-y-6">
                    <form action={async () => {
                         const response  = await updateTask(formData)
                        setShowModal(false)
                        setShowToast({ message: response.message, icon: response.status == 200 ? "success" : "warning", show: true })
                        setTasksData(prevData => ({
                            ...prevData, // Copy the previous state
                            data: prevData?.data.map(task => 
                                task.id === response.data.id
                                    ? { ...task, id: response.data.id }  // Update
                                    : task  // las otras tareas se mantienen igual
                            )
                        }));
                    }}>
                        <div className="grid grid-cols-2 gap-4">
                            {/* Title and Priority */}
                            <div>
                                <div className="mb-2">
                                    <Label htmlFor="title" value="Title" />
                                </div>
                                {loading ? (
                                    <div className="bg-gray-300 h-8 rounded-md animate-pulse"></div>
                                ) : (
                                    <TextInput
                                        id="title"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        placeholder="Project task..."
                                        required
                                    />
                                )}
                            </div>
                            <div>
                                <div className="mb-2">
                                    <Label htmlFor="Priority" value="Priority" />
                                </div>
                                {loading ? (
                                    <div className="bg-gray-300 h-8 rounded-md animate-pulse"></div>
                                ) : (
                                    <Select
                                        name="priorityId"
                                        value={formData.priority.id}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="">Select a value</option>
                                        {dataAssigned?.data?.priorities?.map((priority, index) => (
                                            <option key={index} value={priority.id}>{priority.name}</option>
                                        ))}
                                    </Select>
                                )}
                            </div>

                            {/* Type of Assignment */}
                            <div>
                                <div className="mb-2">
                                    <Label htmlFor="typeOfAssigned" value="Select the assigned type" />
                                </div>
                                {loading ? (
                                    <div className="bg-gray-300 h-8 rounded-md animate-pulse"></div>
                                ) : (
                                    <Select
                                        name="typeOfAssigned"
                                        value={formData.typeOfAssigned}
                                        onChange={e => handleInputChange(e)}
                                        required
                                    >
                                        <option value="">Select a value</option>
                                        <option value="person">Per Person</option>
                                        <option value="group">Per Group</option>
                                    </Select>
                                )}
                            </div>

                            {/* Person or Group Assignment */}
                            {formData.typeOfAssigned !== '' && (
                                <div>
                                    <div className="mb-2">
                                        <Label
                                            htmlFor={formData.typeOfAssigned === "person" ? "perPerson" : "perGroup"}
                                            value={formData.typeOfAssigned === "person" ? "Person assigned" : "Group assigned"}
                                        />
                                    </div>
                                    {loading ? (
                                        <div className="bg-gray-300 h-8 rounded-md animate-pulse"></div>
                                    ) : (
                                        <Select
                                            name={formData.typeOfAssigned === "person" ? "user": "group"}
                                            value={
                                                formData.typeOfAssigned === "person" && formData.user
                                                    ? formData.user.id
                                                    : formData.typeOfAssigned === "group" && formData.group
                                                        ? formData.group.id
                                                        : ""
                                            }
                                            onChange={handleInputChange}
                                            required
                                        >
                                            {formData.typeOfAssigned === 'person' ? (
                                                <>
                                                    <option value="">Select a value</option>
                                                    {dataAssigned?.data?.users.map((person, index) => (
                                                        <option key={index} value={person.id}>{person.name}</option>
                                                    ))}
                                                </>
                                            ) : (
                                                <>
                                                    <option value="">Select a value</option>
                                                    {dataAssigned?.data?.groups.map((group, index) => (
                                                        <option key={index} value={group.id}>{group.name}</option>
                                                    ))}
                                                </>
                                            )}
                                        </Select>
                                    )}
                                </div>
                            )}

                            {/* Description */}
                            <div className="col-span-2 mb-2">
                                <div className="mb-2">
                                    <Label htmlFor="description" value="Description" />
                                </div>
                                {loading ? (
                                    <div className="bg-gray-300 h-20 rounded-md animate-pulse"></div>
                                ) : (
                                    <Textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        placeholder="Describe your task"
                                        required
                                    />
                                )}
                            </div>
                        </div>
                        <div className="w-full">
                            {loading ? (
                                <div className="bg-gray-300 h-10 rounded-md animate-pulse"></div>
                            ) : (
                                <Button type="submit">Edit task</Button>
                            )}
                        </div>
                    </form>
                </div>
            </Modal.Body>
        </Modal>
    );
}
