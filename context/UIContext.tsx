"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface UIContextType {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Default open

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <UIContext.Provider value={{ isSidebarOpen, toggleSidebar }}>
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const context = useContext(UIContext);
  if (!context) throw new Error("useUI must be used within a UIProvider");
  return context;
}