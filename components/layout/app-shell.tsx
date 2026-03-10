import type { ReactNode } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-utvt-bg">
      {/* Sidebar is fixed, but we need to reserve its space for the main content */}
      <Sidebar />
      
      {/* Main content area needs to be offset by sidebar width (260px) */}
      <div className="flex-1 flex flex-col lg:pl-[260px]">
        <Topbar />
        <main className="flex-1 p-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
