"use client";

import { useUI } from "@/context/UIContext";

export default function MainContentWrapper({ children }: { children: React.ReactNode }) {
  const { isSidebarOpen } = useUI();

  return (
    // 👇 UPDATE: When sidebar is closed, padding is now 0 (was md:pl-20)
    <div className={`transition-all duration-300 ${isSidebarOpen ? "md:pl-64" : "pl-0"}`}>
      {children}
    </div>
  );
}