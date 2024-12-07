"use client";
import { SetStateAction, useEffect, useState } from "react";
import { Sidebar } from "flowbite-react";
import {
  HiArrowSmRight,
  HiClipboardCheck,
  HiChevronDoubleLeft,
  HiChevronDoubleRight,
} from "react-icons/hi";
import { logoutAction } from "@/actions/authentication/logout-actions";
interface SidebarProps {
  user: any; // El payload del token
  children: React.ReactNode;
}
import { io, Socket } from "socket.io-client";
import { GlobalProvider } from "@/context/GlobalContext";
export function SidebarComponent({ children, user }: SidebarProps) {
  const [isCollapsed, setCollapsed] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCollapsed(window.innerWidth < 720);
    }
  }, []);

  const [message, setMessage] = useState("");

  const [socket, setSocket] = useState<Socket | null>(null);

  // useEffect(() => {

  //   const newSocket = io(process.env.NEXT_PUBLIC_URL_SERVER, {
  //     transports: ['websocket'],   // define the connection
  //   });

  //   newSocket.on('connect', () => {
  //     console.log('Conectado al servidor WebSocket');  // manage the connection
  //   });

  //   newSocket.on('connect_error', (err) => {
  //     console.error('Error en la conexión WebSocket:', err);   // manage errors in case the socket doesn't make a connection
  //   });

  //   newSocket.on('server_message', (data) => {
  //     console.log('Respuesta del servidor:', data);   //listen to messages from the socket
  //     setMessage(data);
  //   });

  //   setSocket(newSocket); // stablish the socket as a state

  //   return () => {
  //     if (newSocket) {
  //       console.log('Desconectando WebSocket'); //Disconnect the socket after the component is dismounted
  //       newSocket.disconnect();
  //     }
  //   };
  // }, []);

  return (
    <GlobalProvider userLogged={user}>
      <div
        className="grid min-h-screen grid-cols-[200px_1fr]"
        style={{
          gridTemplateColumns: isCollapsed ? "50px 1fr" : "200px 1fr",
        }}
      >
        {/* Sidebar */}
        <div className="min-h-screen bg-gray-800 text-white transition-all duration-300">
          <button
            onClick={() => setCollapsed(!isCollapsed)}
            className="m-2 flex items-center justify-center rounded bg-gray-700 p-2 hover:bg-gray-600"
          >
            {isCollapsed ? <HiChevronDoubleRight /> : <HiChevronDoubleLeft />}
          </button>

          {/* Sidebar Content */}
          {!isCollapsed && (
            <Sidebar aria-label="Sidebar with collapsible functionality">
              <Sidebar.Items>
                <Sidebar.ItemGroup>
                  <Sidebar.Item
                    href="/tasks"
                    icon={HiClipboardCheck}
                    className="flex items-center gap-2"
                  >
                    Tasks
                  </Sidebar.Item>
                  <form action={logoutAction}>
                    <button
                      type="submit"
                      className="group flex w-full items-center rounded-lg text-left text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                    >
                      <Sidebar.Item
                        href=""
                        icon={HiArrowSmRight}
                        className="flex items-center gap-2"
                      >
                        Sign Out
                      </Sidebar.Item>
                    </button>
                  </form>
                </Sidebar.ItemGroup>
              </Sidebar.Items>
            </Sidebar>
          )}
        </div>

        {/* Main Content */}
        <main className="overflow-auto bg-gray-100 p-4">{children}</main>
      </div>
    </GlobalProvider>
  );
}
