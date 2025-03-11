
import React from 'react';
import { Menu, Sun, Moon } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const { theme, toggleTheme, toggleMobileMenu } = useAppContext();
  const isMobile = useIsMobile();

  return (
    <header className="sticky top-0 z-10 bg-background border-b px-4 py-3 flex items-center justify-between">
      <div className="flex items-center">
        {isMobile && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-2" 
            onClick={toggleMobileMenu}
          >
            <Menu size={20} />
            <span className="sr-only">Menu</span>
          </Button>
        )}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-tomato flex items-center justify-center text-white font-bold">
            TE
          </div>
          <h1 className="text-xl font-bold">{title}</h1>
        </div>
      </div>
      <div>
        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
    </header>
  );
};

export default Header;
