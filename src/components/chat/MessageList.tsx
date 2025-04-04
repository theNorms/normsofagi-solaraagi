
import React, { useRef, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import Card from '../common/Card';
import AnimatedTransition from '../common/AnimatedTransition';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'solara';
  timestamp: Date;
}

interface MessageListProps {
  messages: Message[];
  isProcessing: boolean;
}

const MessageList: React.FC<MessageListProps> = ({ messages, isProcessing }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  return (
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
                  ? "bg-primary text-white dark:bg-primary/90" 
                  : "glass border border-white/20 dark:border-white/10"
              )}
            >
              <div className="space-y-2">
                <p className="whitespace-pre-wrap">{message.content}</p>
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
            <Card className="glass border border-white/20 dark:border-white/10">
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
  );
};

export default MessageList;
