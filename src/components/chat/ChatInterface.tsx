
import React, { useState, useEffect } from 'react';
import { 
  talkToSolara, 
  checkSolaraAvailability, 
  refreshApiStatus, 
  setOfflineMode, 
  forceOfflineMode 
} from '@/api/solara';
import { logService } from '../monitoring/LogMonitor';

// Import our new component files
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import ConnectionStatus from './ConnectionStatus';
import ConnectionErrorDialog from './ConnectionErrorDialog';

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
  const [isProcessing, setIsProcessing] = useState(false);
  const [darkMode, setDarkMode] = useState(document.documentElement.classList.contains('dark'));
  const [apiAvailable, setApiAvailable] = useState<boolean>(true);
  const [isOfflineMode, setIsOfflineMode] = useState(forceOfflineMode);
  const [showConnectionDialog, setShowConnectionDialog] = useState(false);
  const [connectionRetryCount, setConnectionRetryCount] = useState(0);
  const [reconnectAttempted, setReconnectAttempted] = useState(false);
  
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setDarkMode(document.documentElement.classList.contains('dark'));
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    
    // Check the API availability when the component mounts
    checkSolaraAvailability().then(available => {
      setApiAvailable(available);
      
      // If API is unavailable on initial load, suggest offline mode
      if (!available && !isOfflineMode) {
        setTimeout(() => {
          setShowConnectionDialog(true);
        }, 500);
      }
    });
    
    return () => observer.disconnect();
  }, []);
  
  // Show a status message when API availability changes
  useEffect(() => {
    if (connectionRetryCount > 0) {
      if (apiAvailable) {
        logService.addLog(`Connection restored after ${connectionRetryCount} attempts`, 'success', 'api');
      } else {
        if (connectionRetryCount >= 3 && !reconnectAttempted && !isOfflineMode) {
          setShowConnectionDialog(true);
        }
      }
    }
  }, [apiAvailable, connectionRetryCount, reconnectAttempted, isOfflineMode]);

  const handleSendMessage = async (messageText: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageText,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);
    
    logService.addLog(`Sending user message: "${messageText.substring(0, 50)}${messageText.length > 50 ? '...' : ''}"`, 'info', 'chat');
    
    try {
      const reply = await talkToSolara(userMessage.content);
      
      const solaraMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: reply,
        sender: 'solara',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, solaraMessage]);
      
      // Check if the response indicates API issues
      const isLocalResponse = 
        reply.includes("limited connectivity") || 
        reply.includes("local knowledge") || 
        reply.includes("local capabilities") ||
        reply.includes("offline mode");
        
      if (isLocalResponse && !isOfflineMode) {
        setApiAvailable(false);
        
        // Auto-retry once after first indication of issues
        if (!reconnectAttempted) {
          setReconnectAttempted(true);
          setTimeout(() => {
            handleRetryConnection();
          }, 2000);
        }
      } else if (!isLocalResponse && !apiAvailable && !isOfflineMode) {
        setApiAvailable(true);
        logService.addLog(`API seems to be working again`, 'success', 'api');
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

  const handleRetryConnection = async () => {
    logService.addLog("Manually checking Solara API connection", "info", "api");
    setConnectionRetryCount(prev => prev + 1);
    
    try {
      const available = await refreshApiStatus();
      setApiAvailable(available);
      
      if (available) {
        setIsOfflineMode(false);
        setOfflineMode(false);
        
        // Add a system message to confirm connection is back
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          content: "Connection to my knowledge center has been restored. How can I assist you?",
          sender: 'solara',
          timestamp: new Date()
        }]);
      } else if (connectionRetryCount >= 2) {
        // After a couple failed retries, suggest offline mode
        setShowConnectionDialog(true);
      }
    } catch (error) {
      console.error("Error during connection retry:", error);
      setApiAvailable(false);
      
      if (connectionRetryCount >= 2) {
        setShowConnectionDialog(true);
      }
    }
  };
  
  const toggleOfflineMode = (enabled: boolean) => {
    setIsOfflineMode(enabled);
    setOfflineMode(enabled);
    
    if (enabled) {
      // Add a system message to confirm offline mode
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        content: "Offline mode enabled. I'm now using enhanced local responses to assist you.",
        sender: 'solara',
        timestamp: new Date()
      }]);
      
      logService.addLog("Offline mode enabled by user", "info", "system");
    } else {
      // If turning off offline mode, attempt to check the API
      handleRetryConnection();
    }
  };
  
  const handleEnableOfflineMode = () => {
    toggleOfflineMode(true);
    setShowConnectionDialog(false);
  };

  return (
    <div className="flex flex-col h-full">
      <ConnectionStatus
        apiAvailable={apiAvailable}
        connectionRetryCount={connectionRetryCount}
        handleRetryConnection={handleRetryConnection}
        isOfflineMode={isOfflineMode}
        toggleOfflineMode={toggleOfflineMode}
      />
      
      <MessageList 
        messages={messages} 
        isProcessing={isProcessing} 
      />
      
      <MessageInput 
        onSendMessage={handleSendMessage}
        isProcessing={isProcessing}
        darkMode={darkMode}
      />
      
      <ConnectionErrorDialog
        open={showConnectionDialog}
        onOpenChange={setShowConnectionDialog}
        onRetry={handleRetryConnection}
        onEnableOfflineMode={handleEnableOfflineMode}
      />
    </div>
  );
};

export default ChatInterface;
