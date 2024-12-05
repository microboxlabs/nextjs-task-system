"use server";

import { cookies } from "next/headers";


export const createTask = async (formData: FormData) => {

  const cookieStore = cookies();
  const token = cookieStore.get("tokenLogin")?.value;
  const title = formData.get("Title") as string;
  const description = formData.get("Description") as string;
  const assigned = formData.get("Assigned") as string; 
  const typeOfAssigned = formData.get("TypeOfAssigned") as string;
  const priority = formData.get("Priority") as string; 
  const taskFormData = {
    title: title as string,
    description: description as string,
    assigned: parseInt(assigned) as number,
    typeOfAssigned: typeOfAssigned as string,
    priority: parseInt(priority) as number,
    token: token as string
  };

const url =   process.env.NEXT_PUBLIC_URL_PAGE + "/api/tasks/create"
  const response = await fetch(
    url,
    {
      method: "POST",
      body: JSON.stringify(taskFormData),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    },
  );
  const data = await response.json();
  console.log(data)
  if (data.status != 200) {
    return { status:data.status, message: data.message };
  }

  return { status:data.status, message: data.message }
};
