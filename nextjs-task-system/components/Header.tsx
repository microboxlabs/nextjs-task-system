import { Role } from "@prisma/client";
import { useAuthStore, useTheme } from "../store";

export default function Header({ setView, view}) {
  const { token, role, logout, username } = useAuthStore((state) => state);
  const { isDarkMode, toggleDarkMode, setLanguage, t } = useTheme();
  
  return (
    <nav className="flex flex-col lg:flex-row justify-between items-center gap-7 p-4 bg-black text-white">
      <div className="flex space-x-4 items-center">
        <p className="text-2xl font-bold">{username}</p>
        {token != "" && role == Role.admin &&
          
          <button
            onClick={() => setView("TableUser")}
            className={`hover:text-[#F0B90B] ${
              view == "TableUser"
                ? "p-2 border rounded-md border-[#F0B90B] text-[#F0B90B]"
                : ""
            }`}
          >
            {t.tableUser}
          </button>
          
        }
        {token != "" && 
          <>
            <button
              onClick={() => setView("TableTask")}
              className={`hover:text-[#F0B90B] ${
                view == "TableTask"
                  ? "p-2 border rounded-md border-[#F0B90B] text-[#F0B90B]"
                  : ""
              }`}
            >
              {t.tableTask}
            </button>
            <button
              onClick={logout}
              className="p-2 border rounded-md border-[#df533b] text-[#df533b]"
            >
              {t.logout}
            </button>
          </>
        }
       
      </div>
      <div className="flex flex-col sm:flex-row gap-4 items-center">    
        <div className="flex gap-2 space-x-4 items-center">
          <button
            className={`flex items-center w-[50px] h-[30px] rounded-[50px] text-[25px] 
        ${isDarkMode ? "justify-end bg-[#4caf50]" : "justify-start bg-[#ccc]"}`}
            onClick={() => toggleDarkMode(!isDarkMode)}
          >
            <div>{isDarkMode ? "🌙" : "☀️"}</div>
          </button>
          <Language setLanguage={setLanguage} t={t} />
        </div>
      </div>
    </nav>
  );
}

const Language = ({ t, setLanguage }) => {
  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => { setLanguage("es")}}
        className={`${
          t.tableTask == "Lista de tareas" ? "border border-white p-1 rounded-md" : ""
        }`}
      >
        Español
      </button>
      <button
        onClick={() => {setLanguage("en")}}
        className={`${
          t.tableTask == "Table task" ? "border border-white p-1 rounded-md" : ""
        }`}
      >
        English
      </button>
    </div>
  );
};