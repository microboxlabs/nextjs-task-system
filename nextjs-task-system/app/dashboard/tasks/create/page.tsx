"use client";

import { combinedOptions } from "@/app/lib/data";
import Form from "@/app/ui/tasks/Create-form";
import { useRouter } from "next/navigation";

export default function CreateTask() {
  const router = useRouter();

  const handleSucess = () => {
    router.push("/dashboard/tasks");
  };

  return (
    <Form combinedOptions={combinedOptions} onSubmitSuccess={handleSucess} />
  );
}
