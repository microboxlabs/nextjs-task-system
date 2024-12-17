"use client";
import { useContext, useEffect, useState } from "react";
import { Dashboard } from "../components/sidebar";
import { FooterPage } from "../components/footer";
import { NavBar } from "../components/navBar";
import { AuthContexts } from "../contexts/authContexts";
import { Navigate } from "react-router";
import { redirect } from "next/navigation";
import { Spinner } from "flowbite-react";

export default function DashboardLayout({
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
    if (!isLoading && !state.isLogged) {
      redirect('/login');
    }
  }, [state.isLogged, isLoading]);

  if (isLoading) {
    return <div className="text-center">
      <Spinner aria-label="Center-aligned spinner example" />
    </div>;
  }

  return (
    <>{state.isLogged &&
      <div>
        <NavBar />

        <main className="flex-1">
          {children}

        </main>
        <FooterPage />
      </div>
    }
    </>
  );
}
