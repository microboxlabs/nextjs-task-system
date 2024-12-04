"use client";
import Header from "@/components/Header";
import { Loading } from "@/components/Icons";
import Login from "@/components/Login";
import Register from "@/components/Register";
import TableTask from "@/components/TableTask";
import TableUser from "@/components/TableUsers";
import { useAuthStore, useTheme, loadingStore } from "@/store";
import { useEffect, useState } from "react";
import io from 'socket.io-client';
import Swal from "sweetalert2";
let socket:any;

export default function Home() {
  const { loading, setLoading } = loadingStore((state) => state);
  const { isDarkMode } = useTheme((state) => state);
  const { id, role } = useAuthStore((state) => state)
  const [view, setView] = useState("");
  
  
  useEffect(() => {
    const socketInitializer = async () => {
      await fetch('/api/socket');
      socket = io();
      socket.on('connect', () => {console.log('Conectado al WebSocket');});
      socket.on('update-input', (msg:{ assignedTo: string[]; message: string }) => {
        if( msg.assignedTo.includes(username)){
          Swal.fire({
          icon: "info",
          title: "actualizacion",
          text: msg.message
          });
        }
      });
    };
    socketInitializer();
    return () => {
      if (socket) socket.disconnect();
    };
  }, []);


  useEffect(() => {
    const socketInitializer = async () => {
      await fetch('/api/socket');
      socket = io();
      socket.on('connect', () => {console.log('Conectado al WebSocket');});
      socket.on('update-input', (msg:{ assignedTo: string[]; message: string }) => {
        if( msg.assignedTo.includes(id)){
          Swal.fire({
          icon: "info",
          title: "actualizacion",
          text: msg.message
          });
        }
      });
    };
    socketInitializer();
    return () => {
      if (socket) socket.disconnect();
    };
  }, []);


  useEffect(() => {
    setLoading(true);
    if (id==""){
      setView("Register")
    }else{
      setView("TableTask")
    }
    setLoading(false);
  }, []);


  return (
    <div
      id={isDarkMode ? "dark" : ""}
      className="min-h-screen bg-[--bg-color] text-[--text-color]"
    >
      <Header setView={setView} view={view} />
      {loading && <Loading/>}
      <div className="relative">
        {view == "Register" && <Register setView={setView} />}
        {view == "Login" && <Login setView={setView} />}
        {view == "TableUser" && <TableUser />}
        {view == "TableTask" && <TableTask />}
      </div>
    </div>
  );
}
