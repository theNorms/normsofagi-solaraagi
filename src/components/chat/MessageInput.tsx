
import React, { useState } from 'react';
import { Send, Mic, MicOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import Button from '../common/Button';
import Input from '../common/Input';
import { toast } from '@/components/ui/use-toast';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  isProcessing: boolean;
  darkMode?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ 
  onSendMessage, 
  isProcessing,
  darkMode = false
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  
  const handleSend = () => {
    if (!inputValue.trim() || isProcessing) return;
    onSendMessage(inputValue);
    setInputValue('');
  };
  
  const toggleRecording = () => {
    setIsRecording(!isRecording);
    
    if (!isRecording) {
      toast({
        title: "Voice recording is coming soon",
        description: "This feature is not yet available in this version.",
      });
    }
  };

  return (
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
              handleSend();
            }
          }}
          className={cn(
            "flex-1",
            darkMode && "text-blue-300 placeholder:text-blue-500/60"
          )}
        />
        
        <Button
          onClick={handleSend}
          disabled={!inputValue.trim() || isProcessing}
          className="flex-shrink-0"
          icon={<Send size={18} />}
        >
          Send
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;
