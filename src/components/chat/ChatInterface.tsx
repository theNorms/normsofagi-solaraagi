import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Send, Mic, MicOff, Loader2, AlertTriangle, RefreshCw } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import Input from '../common/Input';
import AnimatedTransition from '../common/AnimatedTransition';
import { talkToSolara, checkSolaraAvailability } from '@/api/solara';
import { logService } from '../monitoring/LogMonitor';
import { toast } from '@/components/ui/use-toast';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'solara';
  timestamp: Date;
}

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello, I'm Solara. How can I help you today?",
      sender: 'solara',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [darkMode, setDarkMode] = useState(document.documentElement.classList.contains('dark'));
  const [apiAvailable, setApiAvailable] = useState<boolean>(true);
  
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    scrollToBottom();
    
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

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isProcessing) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsProcessing(true);
    
    logService.addLog(`Sending user message: "${inputValue.substring(0, 50)}${inputValue.length > 50 ? '...' : ''}"`, 'info', 'chat');
    
    try {
      if (!apiAvailable) {
        logService.addLog(`Attempting to use Solara API despite known connectivity issues`, 'warning', 'api');
      }
      
      const reply = await talkToSolara(userMessage.content);
      
      const solaraMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: reply,
        sender: 'solara',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, solaraMessage]);
      
      if (reply.includes("unavailable") || reply.includes("connection issues")) {
        setApiAvailable(false);
        logService.addLog(`API response indicates connectivity issues: ${reply.substring(0, 100)}`, 'warning', 'api');
      } else {
        setApiAvailable(true);
        logService.addLog(`Received response from Solara`, 'success', 'api');
      }
    } catch (error) {
      console.error("API Error:", error);
      logService.addLog(`API error: ${error instanceof Error ? error.message : String(error)}`, 'error', 'api');
      
      setMessages(prev => [...prev, {
        id: (Date.now() + 2).toString(),
        content: "I'm having trouble connecting to my knowledge center. Let me help with what I know locally.",
        sender: 'solara',
        timestamp: new Date()
      }]);
      
      setApiAvailable(false);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  const handleRetryConnection = async () => {
    logService.addLog("Manually checking Solara API connection", "info", "api");
    const available = await checkSolaraAvailability();
    setApiAvailable(available);
    
    if (available) {
      toast({
        title: "Connection successful",
        description: "Successfully connected to Solara.",
      });
    } else {
      toast({
        title: "Connection failed",
        description: "Still having trouble connecting to Solara.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col h-full">
      {!apiAvailable && (
        <AnimatedTransition show={true} type="fade">
          <div className="p-2 bg-amber-500/20 border-b border-amber-500/30 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="text-amber-500" size={18} />
              <span>Connection to Solara is limited. Responses may be affected.</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRetryConnection}
              icon={<RefreshCw size={16} />}
            >
              Retry
            </Button>
          </div>
        </AnimatedTransition>
      )}
      
      <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${!apiAvailable ? 'pb-2' : ''}`}>
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
                  <p>Solara is thinking...</p>
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
