"use client";
import { useEffect, useState } from "react";
import { Sidebar } from "flowbite-react";
import {
  HiArrowSmRight,
  HiClipboardCheck,
  HiChevronDoubleLeft,
  HiChevronDoubleRight,
} from "react-icons/hi";
import { logoutAction } from "@/actions/authentication/logout-actions";
interface SidebarProps {
  user: User;
  children: React.ReactNode;
}
import { io } from "socket.io-client";
import { GlobalProvider } from "@/context/GlobalContext";
import { User } from "@/types/global-types";
import NotificationSideBar from "./notificationSideBar";
import { notifications } from "@/types/notifications-types";
import PopUpToast from "./popUpToast";
export function SidebarComponent({ children, user }: SidebarProps) {
  const [isCollapsed, setCollapsed] = useState(true);

  {
    /*Values to show the new toast*/
  }
  const [showToast, setShowToast] = useState<boolean>(false);

  const handleShowToast = () => {
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };
  {
    /*Functions to update an retrieve notifications*/
  }
  const [notifications, setNotifications] = useState<any>([]);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setCollapsed(window.innerWidth < 720);
      //Fetch to recieve all the notifications on the database
      const fetchData = async () => {
        const url = `${process.env.NEXT_PUBLIC_URL_PAGE}/api/notifications/?user=${user.userId}${user.groupId != null ? `&group=${user.groupId.toString()}` : ""}`;

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-store",
          credentials: "include",
        });

        const notificationsResponse = await response.json();

        setNotifications(notificationsResponse.data);
      };

      fetchData();
    }
  }, []);

  useEffect(() => {
    //config of the websocket
    const newSocket = io(process.env.NEXT_PUBLIC_URL_SERVER, {
      transports: ["websocket"],
    });

    newSocket.on("connect", () => {
      console.log(
        "Connected to WebSocket server with socket id:",
        newSocket.id,
      );

      //join to the channels depending if the user has a group or not
      if (user.userId) {
        newSocket.emit("join", user.userId);
        console.log(`Joined channel for user: ${user.userId}`);
      }

      if (user.groupId) {
        newSocket.emit("joinGroup", user.groupId);
        console.log(`Joined channel for group: ${user.groupId}`);
      }
    });

    newSocket.on("server_message", (data) => {
      console.log("Received notification data:", data);
      setNotifications((prevNotifications: notifications[]) => {
        const exists = prevNotifications.some(
          (notification) =>
            notification.message === data.title &&
            notification.createdAt === data.createdAt,
        );
        if (!exists) {
          return [
            ...prevNotifications,
            { message: data.title, createdAt: data.createdAt },
          ];
        }
        return prevNotifications;
      });
      handleShowToast();
    });

    newSocket.on("connect_error", (err) => {
      console.error("WebSocket connection error:", err);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [user.userId, user.groupId]); // Dependencies

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

                  <NotificationSideBar
                    notifications={notifications}
                  ></NotificationSideBar>
                  <form action={logoutAction}>
                    <button
                      type="submit"
                      className="group flex w-full items-center rounded-lg text-left text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                    >
                      <Sidebar.Item
                        href="#"
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
        <main className="overflow-auto bg-gray-100 p-4">
          <PopUpToast setShowToast={setShowToast} showToast={showToast} />
          {children}
        </main>
      </div>
    </GlobalProvider>
  );
}
