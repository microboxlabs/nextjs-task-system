
"use client";
import { CardTasks } from "@/app/components/card";
import { Dashboard } from "@/app/components/sidebar";
import { ModalForm } from "@/app/components/modal";
import { Button, DarkThemeToggle } from "flowbite-react";
import { useContext, useEffect, useState } from "react";
import { AuthContexts } from "@/app/contexts/authContexts";


export default function Tasks() {
  const [openModal, setOpenModal] = useState(false);
  const { state } = useContext(AuthContexts);

  const [filters, setFilters] = useState({user: "",group: "",status: "",priority: "",});

  const handleFilterChange = (name: string,e: any) => {
    setFilters((prev: any) => ({
      ...prev,
      [name]: e.target.value,
    }));

  };



  return (
    <div>
      <main className="dark:bg-gray-800">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:max-w-xs md:w-auto ">
            <Dashboard  handleFilterChange ={handleFilterChange}/>
          </div>
          <div className="flex-1 p-4">
            <div className="flex justify-end w-100">
              {state.user.rol == 'admin' &&
                <Button onClick={() => setOpenModal(true)}>Create Task</Button>
              }
            </div>
            <ModalForm openModal={openModal} setOpenModal={setOpenModal} task={null} />
            <div className="">
              <CardTasks filters={filters}/>
            </div>
          </div>
        </div>
      </main>

    </div>

  );
}