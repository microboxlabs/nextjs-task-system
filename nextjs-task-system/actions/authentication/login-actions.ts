"use server";

import { cookies } from "next/headers";

export const loginUser = async (formData: FormData) => {
  const userEmail = formData.get("email");
  const userPassword = formData.get("password");
  const userLogin = {
    email: userEmail as string,
    password: btoa(userPassword as string).trim(),
  };
  const res = await fetch(process.env.NEXT_PUBLIC_URL_PAGE + "/api/signup", {
    method: "POST",
    body: JSON.stringify(userLogin),
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  const status = res.status;

  const data = await res.json();

  if (data.status != 200) {
    return { status, message: data.message };
  }
  const cookieStore = cookies();
  cookieStore.set({
    name: "tokenLogin",
    value: data.token,
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    path: "/",
    sameSite: "lax",
    expires: new Date(Date.now() + 3600 * 1000),
  });

  return { status, message: data.message, token: data.message };
};
