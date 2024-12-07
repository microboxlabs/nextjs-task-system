"use server";

import { Task } from "@/types/tasks-types";
import { cookies } from "next/headers";

export const createTask = async (formData: FormData) => {
  const cookieStore = cookies();
  const token = cookieStore.get("tokenLogin")?.value;
  const title = formData.get("Title") as string;
  const description = formData.get("Description") as string;
  const assigned = formData.get("Assigned") as string;
  const typeOfAssigned = formData.get("TypeOfAssigned") as string;
  const priority = formData.get("Priority") as string;
  const dueDate = formData.get("DueDate") as string;

  const formattedDueDate = new Date(dueDate).toISOString();
  const taskFormData = {
    title: title as string,
    description: description as string,
    assigned: Number(assigned) as number,
    typeOfAssigned: typeOfAssigned as string,
    priority: Number(priority) as number,
    dueDate: formattedDueDate,
  };

  const url = process.env.NEXT_PUBLIC_URL_PAGE + "/api/tasks/create";
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(taskFormData),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  });
  const data = await response.json();

  if (data.status != 200) {
    return data;
  }

  return data;
};

export const updateTask = async (
  formData: Task & { typeOfAssigned: string },
  valuesData: FormData,
) => {
  const url = process.env.NEXT_PUBLIC_URL_PAGE + "/api/tasks/update";
  const dueDate = valuesData.get("dueDate") as string;
  const cookieStore = cookies();
  const token = cookieStore.get("tokenLogin")?.value;
  const formattedDueDate = new Date(dueDate).toISOString();
  const taskFormData = {
    id: Number(formData.id) as number,
    title: formData.title as string,
    description: formData.description as string,
    user: Number(formData.user?.id) as number,
    typeOfAssigned: formData.typeOfAssigned as string,
    dueDate: formattedDueDate,
    priority: Number(formData.priority.id) as number,
    status: Number(formData.status.id) as number,
    group: Number(formData.group?.id) as number,
  };
  const response = await fetch(url, {
    method: "PUT",
    body: JSON.stringify(taskFormData),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  });

  const data = await response.json();

  if (data.status !== 200) {
    return data;
  }

  return data;
};

export const deleteTask = async (id: number) => {
  const url = process.env.NEXT_PUBLIC_URL_PAGE + "/api/tasks/delete";

  const cookieStore = cookies();
  const token = cookieStore.get("tokenLogin")?.value;
  const taskFormData = {
    id: Number(id) as number,
  };

  try {
    const response = await fetch(url, {
      method: "DELETE",
      body: JSON.stringify(taskFormData),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });

    const responseText = await response.text();

    if (!response.ok) {
      console.error("Error response:", responseText);
      throw new Error(`Error deleting task: ${responseText}`);
    }

    const data = JSON.parse(responseText);
    if (!data) {
      throw new Error("Invalid JSON response");
    }

    if (data.status !== 200) {
      return data;
    }

    return data;
  } catch (error) {
    console.error("Error deleting task:", error);
    return { message: "An error occurred", status: 500 };
  }
};

export const updateTaskModalView = async (
  formData: Task & { typeOfAssigned: string },
  newComment: string,
) => {
  const url = process.env.NEXT_PUBLIC_URL_PAGE + "/api/tasks/update";

  const cookieStore = cookies();
  const token = cookieStore.get("tokenLogin")?.value;
  const formattedDueDate = new Date(formData.dueDate).toISOString();
  const taskFormData = {
    id: Number(formData.id) as number,
    title: formData.title as string,
    description: formData.description as string,
    user: Number(formData.user?.id) as number,
    typeOfAssigned: formData.typeOfAssigned as string,
    dueDate: formattedDueDate,
    priority: Number(formData.priority.id) as number,
    status: Number(formData.status.id) as number,
    group: Number(formData.group?.id) as number,
    newComment: newComment as string,
  };
  const response = await fetch(url, {
    method: "PUT",
    body: JSON.stringify(taskFormData),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  });

  const data = await response.json();

  if (data.status !== 200) {
    return data;
  }

  return data;
};
