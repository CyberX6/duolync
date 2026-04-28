import { ReactNode } from "react";
import AuthenticatedHeader from "./AuthenticatedHeader";
import GroupsPanel from "./GroupsPanel";

interface MainLayoutProps {
  children: ReactNode;
  showGroupsPanel?: boolean;
}

const MainLayout = ({ children, showGroupsPanel = true }: MainLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <AuthenticatedHeader />
      <div className="flex">
        {showGroupsPanel && <GroupsPanel />}
        <main className="flex-1 min-h-[calc(100vh-4rem)] overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
