"use client";
import { useContext, useEffect, useState } from "react";
import { AuthContexts } from "../contexts/authContexts";
import { redirect } from "next/navigation";


export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const { state, checkToken } = useContext(AuthContexts);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      setIsLoading(true);
      await checkToken();
      setIsLoading(false);
    };
    verifyToken();
  }, []);


  useEffect(() => {
    if (!isLoading && state.isLogged) {
      redirect('/dashboard/tasks');
    }
  }, [state.isLogged, isLoading]);

  if (isLoading) {
    return <div>Loading...</div>; 
  }

  return (
    <>
      {!state.isLogged && children}
    </>
  );
}
