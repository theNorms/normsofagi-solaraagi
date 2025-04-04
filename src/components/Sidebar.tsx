
import React from 'react';
import { cn } from '@/lib/utils';
import { MessageCircle, Code2, Workflow, Settings, Database, ArrowRightLeft, BarChart3 } from 'lucide-react';

interface SidebarProps {
  show: boolean;
  setActiveTab: (tab: string) => void;
  activeTab: string;
  className?: string;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  show, 
  setActiveTab, 
  activeTab,
  className 
}) => {
  const navItems: NavItem[] = [
    { id: 'chat', label: 'Chat', icon: <MessageCircle size={20} /> },
    { id: 'framework', label: 'Framework', icon: <Code2 size={20} /> },
    { id: 'workflow', label: 'Workflow', icon: <Workflow size={20} /> },
    { id: 'fine-tuning', label: 'Fine-Tuning', icon: <Database size={20} /> },
    { id: 'integration', label: 'Integration', icon: <ArrowRightLeft size={20} /> },
    { id: 'monitoring', label: 'Monitoring', icon: <BarChart3 size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  return (
    <aside
      className={cn(
        "fixed top-16 left-0 bottom-0 z-10 w-64 border-r transition-transform duration-300",
        "flex flex-col bg-sidebar backdrop-blur-md",
        !show && "-translate-x-full md:translate-x-0",
        className
      )}
    >
      <nav className="p-4 flex-1 overflow-y-auto">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all",
                  activeTab === item.id 
                    ? "bg-primary text-white" 
                    : "hover:bg-secondary text-foreground"
                )}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t bg-sidebar">
        <div className="rounded-lg p-4 text-xs text-center bg-secondary">
          <p className="font-medium">Solara Automator</p>
          <p className="text-muted-foreground">Version 1.0.0</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
