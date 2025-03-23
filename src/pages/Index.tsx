
import React, { useState } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import ChatInterface from '@/components/chat/ChatInterface';
import FrameworkBuilder from '@/components/framework/FrameworkBuilder';
import WorkflowCreator from '@/components/workflow/WorkflowCreator';
import FineTuner from '@/components/fineTuning/FineTuner';
import IntegrationPanel from '@/components/integration/IntegrationPanel';
import MonitoringDashboard from '@/components/monitoring/MonitoringDashboard';

const Index = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [activeTab, setActiveTab] = useState('chat');

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'chat':
        return <ChatInterface />;
      case 'framework':
        return <FrameworkBuilder />;
      case 'workflow':
        return <WorkflowCreator />;
      case 'fine-tuning':
        return <FineTuner />;
      case 'integration':
        return <IntegrationPanel />;
      case 'monitoring':
        return <MonitoringDashboard />;
      case 'settings':
        return (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-2xl font-medium mb-2">Settings</h3>
              <p className="text-muted-foreground">Settings panel will be implemented in future updates.</p>
            </div>
          </div>
        );
      default:
        return <ChatInterface />;
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-background to-secondary">
      <Header toggleSidebar={toggleSidebar} />
      <Sidebar 
        show={showSidebar} 
        setActiveTab={setActiveTab} 
        activeTab={activeTab} 
      />
      
      <main 
        className="flex-1 pt-16 transition-all duration-300" 
        style={{ 
          marginLeft: showSidebar ? '16rem' : '0',
          '@media (max-width: 768px)': {
            marginLeft: '0',
          },
        }}
      >
        <div className="h-[calc(100vh-4rem)]">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default Index;
