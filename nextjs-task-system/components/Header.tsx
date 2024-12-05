import { Role } from "@prisma/client";
import { useAuthStore, useTheme } from "../store";
import { Dispatch, SetStateAction } from "react";
import { ViewState } from "@/app/page";

interface HeaderProps {
  setView: Dispatch<SetStateAction<ViewState>>;
  view: string;
}

export default function Header({ setView, view }: HeaderProps) {
  const { token, role, logout, username } = useAuthStore((state) => state);
  const { isDarkMode, toggleDarkMode, setLanguage, t } = useTheme();
  
  return (
    <nav className="flex flex-col items-center justify-between gap-7 bg-black p-4 text-white lg:flex-row">
      <div className="flex items-center space-x-4">
        <p className="text-2xl font-bold">{username}</p>
        {role === Role.admin && (
          <button
            onClick={() => setView("TableUser")}
            className={`hover:text-[#F0B90B] ${
              view === "TableUser" ? "rounded-md border border-[#F0B90B] p-2 text-[#F0B90B]" : ""
            }`}
          >
            {t.tableUser}
          </button>
        )}
        {token !== "" && (
          <>
            <button
              onClick={() => setView("TableTask")}
              className={`hover:text-[#F0B90B] ${
                view === "TableTask" ? "rounded-md border border-[#F0B90B] p-2 text-[#F0B90B]" : ""
              }`}
            >
              {t.tableTask}
            </button>
            <button
              onClick={logout}
              className="rounded-md border border-[#df533b] p-2 text-[#df533b]"
            >
              {t.logout}
            </button>
          </>
        )}
      </div>
      <div className="flex flex-col items-center gap-4 sm:flex-row">    
        <div className="flex items-center gap-2 space-x-4">
          <button
            className={`flex h-[30px] w-[50px] items-center rounded-[50px] text-[25px] 
        ${isDarkMode ? "justify-end bg-[#4caf50]" : "justify-start bg-[#ccc]"}`}
            onClick={() => toggleDarkMode(!isDarkMode)}
          >
            <div>{isDarkMode ? "🌙" : "☀️"}</div>
          </button>
          <Language setLanguage={setLanguage}  />
        </div>
      </div>
    </nav>
  );
}

interface LanguageProps {
  setLanguage: (language: Language) => void;
}

type Language = "es" | "en";

const Language = ({ setLanguage }: LanguageProps) => {
  const { t } = useTheme();
  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => { setLanguage("es"); }}
        className={`${
          t.tableTask === "Lista de tareas" ? "rounded-md border border-white p-1" : ""
        }`}
      >
        Español
      </button>
      <button
        onClick={() => { setLanguage("en"); }}
        className={`${
          t.tableTask === "Table task" ? "rounded-md border border-white p-1" : ""
        }`}
      >
        English
      </button>
    </div>
  );
};
