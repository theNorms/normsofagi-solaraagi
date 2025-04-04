
import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle, CheckCircle, Info, X, RotateCcw } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import { cn } from '@/lib/utils';

interface LogEntry {
  id: string;
  message: string;
  timestamp: Date;
  level: 'info' | 'warning' | 'error' | 'success';
  source: string;
}

// Create a singleton for managing logs across components
class LogService {
  private static instance: LogService;
  private logs: LogEntry[] = [];
  private listeners: ((logs: LogEntry[]) => void)[] = [];

  private constructor() {}

  public static getInstance(): LogService {
    if (!LogService.instance) {
      LogService.instance = new LogService();
    }
    return LogService.instance;
  }

  addLog(message: string, level: LogEntry['level'] = 'info', source: string = 'system'): void {
    const newLog: LogEntry = {
      id: Date.now().toString(),
      message,
      timestamp: new Date(),
      level,
      source,
    };
    
    this.logs = [newLog, ...this.logs].slice(0, 100); // Keep only last 100 logs
    this.notifyListeners();
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  subscribe(listener: (logs: LogEntry[]) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.getLogs()));
  }

  clearLogs(): void {
    this.logs = [];
    this.notifyListeners();
  }
}

// Export the singleton instance
export const logService = LogService.getInstance();

// Hook for components to use logs
export const useLogMonitor = () => {
  const [logs, setLogs] = useState<LogEntry[]>(logService.getLogs());

  useEffect(() => {
    const unsubscribe = logService.subscribe(setLogs);
    return unsubscribe;
  }, []);

  return {
    logs,
    addLog: logService.addLog.bind(logService),
    clearLogs: logService.clearLogs.bind(logService),
  };
};

const LogMonitor: React.FC = () => {
  const { logs, clearLogs } = useLogMonitor();
  const [filter, setFilter] = useState<string>('all');

  const filteredLogs = logs.filter(log => {
    if (filter === 'all') return true;
    return log.level === filter;
  });

  const getIconForLevel = (level: LogEntry['level']) => {
    switch (level) {
      case 'info': return <Info size={16} className="text-blue-500" />;
      case 'warning': return <AlertTriangle size={16} className="text-amber-500" />;
      case 'error': return <X size={16} className="text-red-500" />;
      case 'success': return <CheckCircle size={16} className="text-green-500" />;
      default: return <Info size={16} className="text-blue-500" />;
    }
  };
  
  return (
    <Card className="h-full flex flex-col glass">
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="text-lg font-medium flex items-center">
          <Clock size={18} className="mr-2" />
          System Logs
        </h3>
        <div className="flex space-x-2">
          <div className="flex rounded-md overflow-hidden">
            {['all', 'info', 'success', 'warning', 'error'].map((level) => (
              <button
                key={level}
                className={cn(
                  "px-2 py-1 text-xs capitalize",
                  filter === level 
                    ? "bg-primary text-white" 
                    : "bg-secondary hover:bg-secondary/80"
                )}
                onClick={() => setFilter(level)}
              >
                {level}
              </button>
            ))}
          </div>
          <Button 
            variant="outline" 
            icon={<RotateCcw size={16} />}
            onClick={clearLogs}
            className="p-2 h-8"
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2">
        <div className="space-y-2">
          {filteredLogs.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              No logs to display
            </div>
          ) : (
            filteredLogs.map(log => (
              <div 
                key={log.id}
                className={cn(
                  "p-2 rounded text-sm border",
                  log.level === 'info' && "bg-blue-50 border-blue-100",
                  log.level === 'warning' && "bg-amber-50 border-amber-100",
                  log.level === 'error' && "bg-red-50 border-red-100",
                  log.level === 'success' && "bg-green-50 border-green-100",
                )}
              >
                <div className="flex items-center">
                  {getIconForLevel(log.level)}
                  <span className="ml-2 font-medium">{log.source}</span>
                  <span className="ml-auto text-xs opacity-70">
                    {log.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                <p className="mt-1 pl-6">{log.message}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </Card>
  );
};

export default LogMonitor;
