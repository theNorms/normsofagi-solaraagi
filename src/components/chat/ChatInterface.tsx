
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Send, Mic, MicOff, Loader2 } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import Input from '../common/Input';
import AnimatedTransition from '../common/AnimatedTransition';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'luna';
  timestamp: Date;
}

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello, I'm Luna. How can I help you today?",
      sender: 'luna',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [darkMode, setDarkMode] = useState(document.documentElement.classList.contains('dark'));
  
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    scrollToBottom();
    
    // Listen for dark mode changes
    const observer = new MutationObserver(() => {
      setDarkMode(document.documentElement.classList.contains('dark'));
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    
    return () => observer.disconnect();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!inputValue.trim() || isProcessing) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsProcessing(true);
    
    // Simulate Luna response after delay
    setTimeout(() => {
      const lunaMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm processing your request. This is a simulated response as we're just building the UI prototype.",
        sender: 'luna',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, lunaMessage]);
      setIsProcessing(false);
    }, 1500);
  };
  
  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // In a real app, we would start/stop voice recording here
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <AnimatedTransition 
            key={message.id} 
            show={true} 
            type="fade"
          >
            <div
              className={cn(
                "max-w-[80%] mb-4 animate-fade-in",
                message.sender === 'user' ? "ml-auto" : "mr-auto"
              )}
            >
              <Card 
                className={cn(
                  "shadow-sm",
                  message.sender === 'user' 
                    ? "bg-primary text-white" 
                    : "glass border border-white/20"
                )}
              >
                <div className="space-y-2">
                  <p>{message.content}</p>
                  <p className="text-xs opacity-70">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </Card>
            </div>
          </AnimatedTransition>
        ))}
        {isProcessing && (
          <AnimatedTransition show={true} type="fade">
            <div className="max-w-[80%] mr-auto">
              <Card className="glass border border-white/20">
                <div className="flex items-center space-x-2">
                  <Loader2 className="animate-spin" size={18} />
                  <p>Luna is thinking...</p>
                </div>
              </Card>
            </div>
          </AnimatedTransition>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t backdrop-blur-sm bg-white/50 dark:bg-black/30">
        <div className="flex space-x-2">
          <Button
            variant={isRecording ? "primary" : "outline"}
            onClick={toggleRecording}
            className="flex-shrink-0"
            icon={isRecording ? <MicOff size={18} /> : <Mic size={18} />}
          >
            {isRecording ? "Stop" : "Voice"}
          </Button>
          
          <Input
            placeholder="Type your message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            className={cn(
              "flex-1",
              darkMode && "text-blue-300 placeholder:text-blue-500/60"
            )}
          />
          
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isProcessing}
            className="flex-shrink-0"
            icon={<Send size={18} />}
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
