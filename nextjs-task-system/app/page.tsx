"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const storedToken = localStorage.getItem("token");

  if (storedToken) {
    return router.push("/dashboard");
  } else {
    return router.push("/login");
  }
}
