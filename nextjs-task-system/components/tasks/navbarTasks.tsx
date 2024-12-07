"use client";
import { useEffect, useState } from "react";
import { Button } from "flowbite-react";
import { HiViewBoards, HiTable, HiFilter, HiDocumentAdd } from "react-icons/hi";
import ListViewTasks from "./table/ListViewTasks";
import BoardViewTasks from "./board/boardViewTasks";
import ModalFilters from "./modals/modalFilters";
import ModalCreateTask from "./modals/modalCreateTask";
import { Filters, ResponseTaskGet } from "@/types/tasks-types";
import Loading from "@/components/loadingskeletons/loading";
import { DynamicBanner } from "../layout/bannerMessage";
import { TaskProvider, useTaskContext } from "@/context/TaskContext";
import { useGlobalContext } from "@/context/GlobalContext";
import { User } from "@/types/global-types";
import { generateQueryParams } from "@/actions/filters/filters";

export default function CustomNavbarWithFilters() {
  const userLogged: User = useGlobalContext();
  const { filters } = useTaskContext();
  const [filtersOpen, setFiltersOpen] = useState<boolean>(false);
  const [activeView, setActiveView] = useState<string>("Board");
  const [createOpen, setCreateOpen] = useState<boolean>(false);
  const [tasksData, setTasksData] = useState<ResponseTaskGet>({
    data: [],
    message: "",
    status: 0,
  });
  const [showToast, setShowToast] = useState<{
    show: boolean;
    message: string;
    icon: "alert" | "warning" | "success" | "";
  }>({ show: false, message: "", icon: "" });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const handleViewChange = (view: string) => setActiveView(view);

  {
    /* activate the filters by the update of the state filters */
  }
  useEffect(() => {
    const fetchData = async () => {
      const queryParams = generateQueryParams(filters);
      const url = `${process.env.NEXT_PUBLIC_URL_PAGE}/api/tasks/?${queryParams}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
        credentials: "include",
      });

      const responseData: ResponseTaskGet = await response.json();
      setTasksData({
        data: responseData.data,
        message: responseData.message,
        status: responseData.status,
      });
      setIsLoading(false);
    };

    fetchData();
  }, [filters]);

  return (
    <div className="flex min-h-screen flex-col p-4">
      <div className="mb-4 items-center justify-between rounded bg-gray-100 p-3 shadow-md md:flex">
        <div className="mb-3 flex gap-4 md:mb-0">
          <Button
            disabled={isLoading}
            onClick={() => handleViewChange("Board")}
            color={activeView === "Board" ? "gray" : "primary"}
            className={`flex items-center gap-2`}
          >
            <HiViewBoards className="size-5" />
            Board
          </Button>
          <Button
            disabled={isLoading}
            onClick={() => handleViewChange("Table")}
            color={activeView === "Table" ? "gray" : "primary"}
            className={`flex items-center gap-2`}
          >
            <HiTable className="size-5" />
            Table
          </Button>
        </div>

        <div className="flex gap-4">
          {userLogged.rol === 1 && (
            <Button
              disabled={isLoading}
              onClick={() => setCreateOpen(true)}
              color="gray"
            >
              <HiDocumentAdd className="size-5" />
              New task
            </Button>
          )}

          <Button
            disabled={isLoading}
            onClick={() => setFiltersOpen(true)}
            color="gray"
          >
            <HiFilter className="size-5" />
            Filters
          </Button>
        </div>
      </div>
      {/*Dynamic banner for the api response*/}
      <DynamicBanner
        icon={showToast.icon}
        message={showToast.message}
        setShowToast={setShowToast}
        showToast={showToast.show}
      />
      {/* Contenedor para contenido con scroll */}

      <div className="max-h-screen flex-1 overflow-auto p-4">
        {isLoading ? (
          <Loading />
        ) : (
          <>
            {activeView === "Board" && (
              <BoardViewTasks
                tasks={tasksData?.data ?? []}
                setTasksData={setTasksData}
                setShowToast={setShowToast}
              />
            )}
            {activeView === "Table" && (
              <ListViewTasks
                tasks={tasksData?.data ?? []}
                setTasksData={setTasksData}
                setShowToast={setShowToast}
              />
            )}
          </>
        )}
      </div>

      {/* Modales para Funcionalidades */}
      <ModalFilters
        filtersOpen={filtersOpen}
        setFiltersOpen={setFiltersOpen}
        isAdmin={userLogged.userId === 1}
      />
      <ModalCreateTask
        createOpen={createOpen}
        setCreateOpen={setCreateOpen}
        setTasksData={setTasksData}
        setShowToast={setShowToast}
      />
    </div>
  );
}
