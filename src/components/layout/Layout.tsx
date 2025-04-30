import React, { ReactNode } from "react";
import { useAppContext } from "@/context/AppContext";
import Header from "./Header";
import Sidebar from "./Sidebar";
import MobileNavigation from "./MobileNavigation";

interface LayoutProps {
  children: ReactNode;
  title: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  const { isMobile } = useAppContext();

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Sidebar - only show on desktop */}
      {!isMobile && <Sidebar />}

      {/* Main content area */}
      <div className="flex flex-col flex-1 w-full overflow-hidden">
        <Header title={title} />
        
        <main className={`flex-1 overflow-auto p-4 pb-safe ${isMobile ? 'pb-20' : 'pb-6'}`}>
          {children}
        </main>

        {/* Mobile navigation - only show on mobile */}
        {isMobile && <MobileNavigation />}
      </div>
    </div>
  );
};

export default Layout;
