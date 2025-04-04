
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sun, Moon } from 'lucide-react';
import ChatInterface from '@/components/chat/ChatInterface';
import { Button } from '@/components/ui/button';

const ChatPage: React.FC = () => {
  const [darkMode, setDarkMode] = React.useState(
    document.documentElement.classList.contains('dark')
  );

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-secondary">
      <header className="h-16 px-4 backdrop-blur-md border-b flex items-center justify-between bg-white/80 dark:bg-black/50 border-black/5 dark:border-white/10">
        <div className="flex items-center">
          <Link to="/app">
            <Button variant="ghost" size="sm" className="mr-4">
              <ArrowLeft size={18} className="mr-1" />
              Back
            </Button>
          </Link>
          
          <div className="flex items-center space-x-3">
            <img 
              src="/lovable-uploads/68ca9d66-c2ef-4e4e-8ff9-a87c0fe7c58c.png" 
              alt="Solara Logo" 
              className="w-8 h-8 rounded-full"
            />
            <span className="font-medium">Solara Chat</span>
          </div>
        </div>
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleDarkMode}
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </Button>
      </header>
      
      <div className="flex-1 h-[calc(100vh-4rem)]">
        <ChatInterface />
      </div>
    </div>
  );
};

export default ChatPage;
