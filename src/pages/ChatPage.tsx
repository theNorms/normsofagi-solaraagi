
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sun, Moon, Volume2, VolumeX } from 'lucide-react';
import ChatInterface from '@/components/chat/ChatInterface';
import { Button } from '@/components/ui/button';
import { speechManager } from '@/utils/voiceUtils';
import { toast } from '@/components/ui/use-toast';

const ChatPage: React.FC = () => {
  const [darkMode, setDarkMode] = React.useState(
    document.documentElement.classList.contains('dark')
  );
  
  const [voiceEnabled, setVoiceEnabled] = React.useState(true);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };
  
  const toggleVoice = () => {
    // If currently enabled, stop any active speech
    if (voiceEnabled) {
      speechManager.stop();
      toast({
        title: "Voice responses disabled",
        description: "Text-to-speech has been turned off.",
      });
    } else {
      toast({
        title: "Voice responses enabled",
        description: "Solara can now speak responses aloud.",
      });
    }
    
    setVoiceEnabled(!voiceEnabled);
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
        
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={toggleVoice}
            title={voiceEnabled ? "Disable voice responses" : "Enable voice responses"}
          >
            {voiceEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleDarkMode}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </Button>
        </div>
      </header>
      
      <div className="flex-1 h-[calc(100vh-4rem)]">
        <ChatInterface />
      </div>
    </div>
  );
};

export default ChatPage;

