import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { CpuIcon, HardDrive, Globe, Clock, Database, Zap, FileText, User, RotateCcw } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';

// Simulated performance data
const performanceData = [
  { name: '00:00', cpu: 15, memory: 20, api: 10 },
  { name: '01:00', cpu: 20, memory: 25, api: 15 },
  { name: '02:00', cpu: 25, memory: 30, api: 18 },
  { name: '03:00', cpu: 30, memory: 35, api: 25 },
  { name: '04:00', cpu: 20, memory: 30, api: 20 },
  { name: '05:00', cpu: 25, memory: 28, api: 15 },
  { name: '06:00', cpu: 30, memory: 32, api: 20 },
  { name: '07:00', cpu: 35, memory: 40, api: 25 },
  { name: '08:00', cpu: 40, memory: 45, api: 30 },
  { name: '09:00', cpu: 45, memory: 50, api: 35 },
  { name: '10:00', cpu: 50, memory: 55, api: 40 },
  { name: '11:00', cpu: 45, memory: 50, api: 35 },
];

// Simulated API usage data
const apiUsageData = [
  { name: 'Chat', calls: 350 },
  { name: 'Framework', calls: 120 },
  { name: 'Workflow', calls: 180 },
  { name: 'Fine-Tune', calls: 80 },
  { name: 'Integration', calls: 200 },
];

const MonitoringDashboard: React.FC = () => {
  return (
    <div className="h-full flex flex-col space-y-6 p-6 overflow-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Monitoring Dashboard</h2>
        <Button 
          variant="outline"
          icon={<RotateCcw size={18} />}
        >
          Refresh Data
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CpuIcon size={20} className="text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">CPU Usage</p>
              <p className="text-2xl font-semibold">45%</p>
            </div>
          </div>
        </Card>
        
        <Card className="glass p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <HardDrive size={20} className="text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Memory Usage</p>
              <p className="text-2xl font-semibold">1.2 GB</p>
            </div>
          </div>
        </Card>
        
        <Card className="glass p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Globe size={20} className="text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">API Calls</p>
              <p className="text-2xl font-semibold">930</p>
            </div>
          </div>
        </Card>
        
        <Card className="glass p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Clock size={20} className="text-amber-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Response Time</p>
              <p className="text-2xl font-semibold">238 ms</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="glass">
          <div className="p-4 border-b">
            <h3 className="text-lg font-medium">System Performance</h3>
          </div>
          <div className="p-4 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#888" />
                <YAxis tick={{ fontSize: 12 }} stroke="#888" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(4px)',
                    borderRadius: '0.5rem',
                    border: '1px solid rgba(0, 0, 0, 0.05)',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }} 
                />
                <Line type="monotone" dataKey="cpu" stroke="#4d7dff" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="memory" stroke="#a855f7" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="api" stroke="#10b981" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="px-4 pb-4 flex justify-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-primary"></div>
              <span className="text-xs">CPU</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-purple-500"></div>
              <span className="text-xs">Memory</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-xs">API Calls</span>
            </div>
          </div>
        </Card>

        <Card className="glass">
          <div className="p-4 border-b">
            <h3 className="text-lg font-medium">API Usage by Feature</h3>
          </div>
          <div className="p-4 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={apiUsageData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#888" />
                <YAxis tick={{ fontSize: 12 }} stroke="#888" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(4px)',
                    borderRadius: '0.5rem',
                    border: '1px solid rgba(0, 0, 0, 0.05)',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                  formatter={(value) => [`${value} calls`, 'API Calls']}
                />
                <Bar dataKey="calls" fill="#4d7dff" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass">
          <div className="p-4 border-b">
            <h3 className="text-lg font-medium">Resource Summary</h3>
          </div>
          <div className="divide-y">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Database size={18} className="text-primary" />
                <span>Database Connections</span>
              </div>
              <span className="font-medium">12</span>
            </div>
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <User size={18} className="text-primary" />
                <span>Active Users</span>
              </div>
              <span className="font-medium">3</span>
            </div>
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Zap size={18} className="text-primary" />
                <span>Processing Tasks</span>
              </div>
              <span className="font-medium">5</span>
            </div>
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FileText size={18} className="text-primary" />
                <span>Log Files</span>
              </div>
              <span className="font-medium">24</span>
            </div>
          </div>
        </Card>

        <Card className="glass md:col-span-2">
          <div className="p-4 border-b">
            <h3 className="text-lg font-medium">System Logs</h3>
          </div>
          <div className="p-4 max-h-80 overflow-y-auto font-mono text-xs">
            <div className="space-y-2">
              <div className="p-2 bg-green-50 rounded border border-green-100">
                <span className="text-green-600">[INFO] 10:23:45</span> - Application started successfully
              </div>
              <div className="p-2 bg-blue-50 rounded border border-blue-100">
                <span className="text-blue-600">[DEBUG] 10:24:12</span> - Connected to AI endpoint
              </div>
              <div className="p-2 bg-blue-50 rounded border border-blue-100">
                <span className="text-blue-600">[DEBUG] 10:25:30</span> - API call to /api/chat completed in 245ms
              </div>
              <div className="p-2 bg-amber-50 rounded border border-amber-100">
                <span className="text-amber-600">[WARN] 10:26:15</span> - Slow response from framework builder module
              </div>
              <div className="p-2 bg-blue-50 rounded border border-blue-100">
                <span className="text-blue-600">[DEBUG] 10:28:03</span> - Loading workflow configuration
              </div>
              <div className="p-2 bg-blue-50 rounded border border-blue-100">
                <span className="text-blue-600">[DEBUG] 10:30:45</span> - User authentication successful
              </div>
              <div className="p-2 bg-green-50 rounded border border-green-100">
                <span className="text-green-600">[INFO] 10:32:21</span> - New model version created: customer-support-1.2
              </div>
              <div className="p-2 bg-red-50 rounded border border-red-100">
                <span className="text-red-600">[ERROR] 10:35:07</span> - Failed to connect to database: timeout
              </div>
              <div className="p-2 bg-green-50 rounded border border-green-100">
                <span className="text-green-600">[INFO] 10:38:59</span> - Database connection restored
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default MonitoringDashboard;
