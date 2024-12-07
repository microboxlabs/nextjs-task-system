"use client";
import { createTask } from "@/actions/tasks/task-actions";

import { ResponseSelectAssigned, ResponseTaskGet } from "@/types/tasks-types";
import {
  Button,
  Datepicker,
  Label,
  Modal,
  Select,
  Textarea,
  TextInput,
} from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
interface props {
  createOpen: boolean;
  setCreateOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setTasksData: React.Dispatch<React.SetStateAction<ResponseTaskGet>>;
  setShowToast: React.Dispatch<
    React.SetStateAction<{
      show: boolean;
      message: string;
      icon: "alert" | "warning" | "success" | "";
    }>
  >;
}
export default function ModalCreateTask({
  createOpen,
  setCreateOpen,
  setTasksData,
  setShowToast,
}: props) {
  const [typeOfAssigned, setTypeOfAssigned] = useState<string>("");
  const [dataAssigned, setDataAssigned] = useState<ResponseSelectAssigned>();

  const [loading, setLoading] = useState<boolean>(true);

  //useffect to load the data in the select section
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
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

    if (loading) {
      fetchData();
    }
  }, [loading, typeOfAssigned]);

  if (dataAssigned?.status != 200 && !loading) {
    return (
      <Modal
        className="min-h-screen"
        show={createOpen}
        size="md"
        onClose={() => setCreateOpen(false)}
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
      {/* Modals with form to create a new task */}
      <Modal
        className="min-h-screen"
        show={createOpen}
        size="lg"
        onClose={() => setCreateOpen(false)}
        popup
      >
        <Modal.Header>Create Task</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <form
              action={async (formData) => {
                const response = await createTask(formData);
                setCreateOpen(false);
                setShowToast({
                  message: response.message,
                  icon: response.status == 200 ? "success" : "warning",
                  show: true,
                });

                setTypeOfAssigned("");
                if (response.status == 200) {
                  setTasksData((prevData) => ({
                    ...prevData, // copy the previous state
                    data: [...(prevData?.data ?? []), response.data], // Add the new task to the array
                  }));
                }
              }}
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="mb-2 ">
                    <Label htmlFor="title" value="Title" />
                  </div>
                  <TextInput
                    id="title"
                    name="Title"
                    placeholder="Project task..."
                    required
                  />
                </div>
                <div>
                  <div className="mb-2 ">
                    <Label htmlFor="Priority" value="Priority" />
                  </div>
                  <Select id="Priority" name="Priority" required>
                    <option value="">Select a value</option>
                    {dataAssigned?.data?.priorities.map((priority, index) => (
                      <option key={index} value={priority.id}>
                        {priority.name}{" "}
                      </option>
                    ))}
                  </Select>
                </div>
                <div>
                  <div className="mb-2 ">
                    <Label
                      htmlFor="typeOfAssigned"
                      value="Select the assigned type"
                    />
                  </div>
                  <Select
                    onChange={(value) => setTypeOfAssigned(value.target.value)}
                    name="TypeOfAssigned"
                    id="typeOfAssigned"
                    required
                  >
                    <option value="">Select a value</option>

                    <option value={"person"}>Per Person</option>
                    <option value={"group"}>Per Group</option>
                  </Select>
                </div>
                {typeOfAssigned != "" && (
                  <div>
                    <div className="mb-2 ">
                      <Label
                        htmlFor={
                          typeOfAssigned == "person" ? `perPerson` : `perGroup`
                        }
                        value={
                          typeOfAssigned == "person"
                            ? `Person assigned`
                            : `Group assigned`
                        }
                      />
                    </div>
                    <Select
                      id={typeOfAssigned == "person" ? `perPerson` : `perGroup`}
                      name="Assigned"
                      required
                    >
                      {typeOfAssigned == "person" ? (
                        <>
                          <option value="">Select a value</option>
                          {dataAssigned?.data?.users.map((person, index) => (
                            <option key={index} value={person.id}>
                              {person.name}{" "}
                            </option>
                          ))}
                        </>
                      ) : (
                        <>
                          <option value="">Select a value</option>
                          {dataAssigned?.data?.groups.map((group, index) => (
                            <option key={index} value={group.id}>
                              {group.name}{" "}
                            </option>
                          ))}
                        </>
                      )}
                    </Select>
                  </div>
                )}
                <div className="col-span-2 mb-10">
                  <div className="mb-2">
                    <Label htmlFor="DueDate" value="Due date" />
                  </div>
                  <Datepicker
                    name="DueDate"
                    id="dueDate"
                    className="absolute"
                    required
                  />
                </div>

                <div className="col-span-2 mb-2">
                  <div className="mb-2">
                    <Label htmlFor="description" value="Description" />
                  </div>
                  <Textarea
                    id="description"
                    name="Description"
                    placeholder="Describe your task"
                    required
                  />
                </div>
              </div>

              <div className="w-full">
                <Button type="submit">Save task</Button>
              </div>
            </form>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
