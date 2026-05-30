"use client";

import { ReactNode } from "react";
import AuthenticatedHeader from "./AuthenticatedHeader";
import GroupsPanel from "./GroupsPanel";
import { useAuth } from "@/hooks/useAuth";

interface MainLayoutProps {
  children: ReactNode;
  showGroupsPanel?: boolean;
}

const MainLayout = ({ children, showGroupsPanel = true }: MainLayoutProps) => {
  const { profile } = useAuth();

  return (
    <div
      className="min-h-screen bg-zinc-50 dark:bg-[#09090b] text-zinc-900 dark:text-zinc-50 transition-colors duration-300 flex flex-col"
      data-role={profile?.user_type ?? "creator"}
    >
      <AuthenticatedHeader />
      <div className="flex flex-1 items-stretch min-h-0">
        {showGroupsPanel && <GroupsPanel />}
        <main className="flex-1 min-w-0 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
