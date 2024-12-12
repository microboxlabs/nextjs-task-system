
"use client";
import { CardTasks } from "@/app/components/card";
import { Dashboard } from "@/app/components/sidebar";
import { ModalForm } from "@/app/components/modal";
import { Button, DarkThemeToggle } from "flowbite-react";
import { useState } from "react";


export default function Tasks() {
  const [openModal, setOpenModal] = useState(false);
  return (
    <div>
      <main className="dark:bg-gray-800">
     
     <div className="flex justify-end w-100">
      <Button onClick={() => setOpenModal(true)}>Create Task</Button>
      </div> 
        <ModalForm openModal={openModal} setOpenModal={setOpenModal}/>
        <div className="">
          <CardTasks />
        </div>
      </main>
    </div>

  );
}