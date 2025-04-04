
import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AnimatedTransition from '../common/AnimatedTransition';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface ConnectionStatusProps {
  apiAvailable: boolean;
  connectionRetryCount: number;
  handleRetryConnection: () => void;
  isOfflineMode: boolean;
  toggleOfflineMode: (value: boolean) => void;
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  apiAvailable,
  connectionRetryCount,
  handleRetryConnection,
  isOfflineMode,
  toggleOfflineMode
}) => {
  const showWarning = !apiAvailable || isOfflineMode;

  return (
    <AnimatedTransition show={showWarning} type="fade">
      <div className="p-2 bg-amber-500/20 dark:bg-amber-900/30 border-b border-amber-500/30 dark:border-amber-700/30">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="text-amber-500 dark:text-amber-400" size={18} />
            <span className="text-sm">
              {isOfflineMode 
                ? "Offline mode enabled. Using local responses." 
                : "Connection to Solara is limited. Responses may be affected."}
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2">
              <Switch 
                id="offline-mode"
                checked={isOfflineMode}
                onCheckedChange={toggleOfflineMode}
              />
              <Label htmlFor="offline-mode" className="text-sm">Offline Mode</Label>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleRetryConnection}
              disabled={isOfflineMode}
              className="whitespace-nowrap"
            >
              <RefreshCw size={16} className={connectionRetryCount > 0 && !isOfflineMode ? "mr-2 animate-spin" : "mr-2"} />
              Retry Connection
            </Button>
          </div>
        </div>
      </div>
    </AnimatedTransition>
  );
};

export default ConnectionStatus;
