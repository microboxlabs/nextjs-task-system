// context/GlobalContext.tsx
import { User } from "@/types/global-types";
import React, { createContext, useState, useContext, ReactNode } from "react";

const GlobalContext = createContext<User | null>(null);

interface GlobalProviderProps {
  children: ReactNode;
  userLogged: User;
}

export const GlobalProvider = ({
  children,
  userLogged,
}: GlobalProviderProps) => {
  const [globalUser, setGlobalUser] = useState<User | null>(userLogged);

  return (
    <GlobalContext.Provider value={globalUser}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (context === null) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
};
