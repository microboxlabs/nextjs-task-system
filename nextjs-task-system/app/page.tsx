"use client";
import Header from "@/components/Header";
import { Loading } from "@/components/Icons";
import Login from "@/components/Login";
import Register from "@/components/Register";
import TableTask from "@/components/TableTask";
import TableUser from "@/components/TableUsers";
import { useAuthStore, useTheme, loadingStore } from "@/store";
import { useEffect, useState } from "react";
import io, { Socket } from 'socket.io-client';
import Swal from "sweetalert2";

interface UpdateInputMessage {
  assignedTo: string[];
  message: string;
}

export type ViewState = "Register" | "Login" | "TableUser" | "TableTask" | "";

let socket: Socket | null = null;

export default function Home() {
  const { loading, setLoading } = loadingStore((state) => state);
  const { isDarkMode, t } = useTheme((state) => state);
  const { id } = useAuthStore((state) => state);
  const [view, setView] = useState<ViewState>("");

  useEffect(() => {
    const socketInitializer = async () => {
      await fetch('/api/socket');
      socket = io();
      socket.on('connect', () => {console.log('Conectado al WebSocket');});
      socket.on('update-input', (msg: UpdateInputMessage) => {
        if (msg.assignedTo.includes(id)) {
          Swal.fire({
            icon: "info",
            title: t.update,
            text: msg.message,
          });
        }
      });
    };
    socketInitializer();
    return () => {
      if (socket) socket.disconnect();
    };
  }, [id]);

  useEffect(() => {
    setLoading(true);
    if (id === "") {
      setView("Register");
    } else {
      setView("TableTask");
    }
    setLoading(false);
  }, [id]);

  return (
    <div
      id={isDarkMode ? "dark" : ""}
      className="min-h-screen bg-[--bg-color] text-[--text-color]"
    >
      <Header setView={setView} view={view} />
      {loading && <Loading />}
      <div className="relative">
        {view === "Register" && <Register setView={setView} />}
        {view === "Login" && <Login setView={setView} />}
        {view === "TableUser" && <TableUser />}
        {view === "TableTask" && <TableTask />}
      </div>
    </div>
  );
}
