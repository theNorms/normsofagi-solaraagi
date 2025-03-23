
import React from 'react';
import { cn } from '@/lib/utils';
import { Menu, Moon, Sun } from 'lucide-react';
import Button from './common/Button';

interface HeaderProps {
  toggleSidebar: () => void;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, className }) => {
  const [darkMode, setDarkMode] = React.useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-10 h-16 px-4 backdrop-blur-md border-b",
        "flex items-center justify-between transition-colors duration-300",
        darkMode ? "bg-black/50 border-white/10" : "bg-white/80 border-black/5",
        className
      )}
    >
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={toggleSidebar}
          className="mr-2 md:hidden"
          icon={<Menu size={18} />}
        >
          <span className="sr-only">Toggle menu</span>
        </Button>
        
        <div className="flex items-center space-x-3">
          <img 
            src="/lovable-uploads/68ca9d66-c2ef-4e4e-8ff9-a87c0fe7c58c.png" 
            alt="Luna Logo" 
            className="w-10 h-10 rounded-full"
          />
          <div className="flex flex-col">
            <span className="font-medium text-xs md:text-sm">AUTOMATED AI DEVELOPMENT ORCHESTRATION TOOL</span>
            <span className="text-xs text-muted-foreground">from LunaTech AI Development by Norman dela Paz Tabora</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={toggleDarkMode}
          icon={darkMode ? <Sun size={18} /> : <Moon size={18} />}
        >
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
    </header>
  );
};

export default Header;
