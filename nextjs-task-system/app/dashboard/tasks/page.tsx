
"use client";
import { CardTasks } from "@/app/components/card";
import { Dashboard } from "@/app/components/sidebar";
import { ModalForm } from "@/app/components/modal";
import { Button, DarkThemeToggle } from "flowbite-react";
import { useContext, useState } from "react";
import { AuthContexts } from "@/app/contexts/authContexts";


export default function Tasks() {
  const [openModal, setOpenModal] = useState(false);
  const { state } = useContext(AuthContexts);
  return (
    <div>
      <main className="dark:bg-gray-800">

        <div className="flex justify-end w-100">
          {state.user.rol == 'admin' &&
            <Button onClick={() => setOpenModal(true)}>Create Task</Button>
          }
        </div>
        <ModalForm openModal={openModal} setOpenModal={setOpenModal} task={null} />
        <div className="">
          <CardTasks />
        </div>
      </main>
    </div>

  );
}