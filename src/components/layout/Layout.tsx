
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import Sidebar from './Sidebar';
import MobileNavigation from './MobileNavigation';
import Header from './Header';
import { useAppContext } from '@/context/AppContext';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  const isMobile = useIsMobile();
  const { isMobileMenuOpen } = useAppContext();

  return (
    <div className="min-h-screen flex flex-col">
      {isMobile ? (
        <>
          <Header title={title} />
          <main className="flex-1 pb-16 px-4 py-4 overflow-auto">
            {children}
          </main>
          <MobileNavigation />
        </>
      ) : (
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-auto">
            <Header title={title} />
            <main className="flex-1 px-6 py-6 overflow-auto">
              {children}
            </main>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;
