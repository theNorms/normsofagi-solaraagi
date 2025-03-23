
import React, { useState } from 'react';
import { Code, Globe, Database, Server, CheckCircle, AlertCircle, Layers, GitBranch } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import Input from '../common/Input';

interface IntegrationStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'error';
}

const IntegrationPanel: React.FC = () => {
  const [repositoryUrl, setRepositoryUrl] = useState('');
  const [apiEndpoint, setApiEndpoint] = useState('');
  const [deploymentTarget, setDeploymentTarget] = useState('local');
  const [integrationSteps, setIntegrationSteps] = useState<IntegrationStep[]>([
    {
      id: '1',
      title: 'Initialize Project',
      description: 'Create project structure and configuration files',
      status: 'completed',
    },
    {
      id: '2',
      title: 'Connect API',
      description: 'Link the application to the AI agent API endpoints',
      status: 'pending',
    },
    {
      id: '3',
      title: 'Generate Frontend',
      description: 'Build responsive UI components',
      status: 'pending',
    },
    {
      id: '4',
      title: 'Implement Backend',
      description: 'Set up server and database connections',
      status: 'pending',
    },
    {
      id: '5',
      title: 'Deploy Application',
      description: 'Deploy the integrated application',
      status: 'pending',
    },
  ]);

  const startIntegration = () => {
    // In a real app, this would trigger the integration process
    setIntegrationSteps(
      integrationSteps.map((step) => {
        if (step.id === '2') {
          return { ...step, status: 'in-progress' };
        }
        return step;
      })
    );

    // Simulate the integration process
    setTimeout(() => {
      setIntegrationSteps(
        integrationSteps.map((step) => {
          if (step.id === '2') {
            return { ...step, status: 'completed' };
          }
          if (step.id === '3') {
            return { ...step, status: 'in-progress' };
          }
          return step;
        })
      );
    }, 2000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={18} className="text-green-500" />;
      case 'in-progress':
        return (
          <svg className="animate-spin h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        );
      case 'error':
        return <AlertCircle size={18} className="text-red-500" />;
      default:
        return <div className="h-4 w-4 border-2 border-muted rounded-full"></div>;
    }
  };

  return (
    <div className="h-full flex flex-col space-y-6 p-6 overflow-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Integration Panel</h2>
        <Button 
          variant="primary"
          icon={<Layers size={18} />}
          onClick={startIntegration}
          disabled={!apiEndpoint}
        >
          Start Integration
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card className="glass">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Integration Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="API Endpoint"
                  value={apiEndpoint}
                  onChange={(e) => setApiEndpoint(e.target.value)}
                  placeholder="https://api.example.com/v1"
                />
                <Input
                  label="Repository URL"
                  value={repositoryUrl}
                  onChange={(e) => setRepositoryUrl(e.target.value)}
                  placeholder="https://github.com/username/repo"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">Deployment Target</label>
                <div className="flex space-x-2">
                  <Button
                    variant={deploymentTarget === 'local' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setDeploymentTarget('local')}
                  >
                    Local
                  </Button>
                  <Button
                    variant={deploymentTarget === 'cloud' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setDeploymentTarget('cloud')}
                  >
                    Cloud
                  </Button>
                  <Button
                    variant={deploymentTarget === 'docker' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setDeploymentTarget('docker')}
                  >
                    Docker
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          <Card className="glass">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Integration Steps</h3>
              <div className="space-y-4">
                {integrationSteps.map((step, index) => (
                  <div 
                    key={step.id} 
                    className={`p-4 border rounded-lg flex items-start space-x-3 ${
                      step.status === 'in-progress' 
                        ? 'border-primary bg-primary/5' 
                        : step.status === 'completed'
                        ? 'border-green-200 bg-green-50'
                        : step.status === 'error'
                        ? 'border-red-200 bg-red-50'
                        : 'border-border'
                    }`}
                  >
                    <div className="mt-0.5">{getStatusIcon(step.status)}</div>
                    <div className="flex-1">
                      <div className="flex items-center">
                        <span className="text-sm font-medium">{index + 1}. {step.title}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="glass">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Technologies</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Globe size={18} className="text-primary" />
                  <div>
                    <p className="font-medium text-sm">Frontend</p>
                    <p className="text-xs text-muted-foreground">React, Tailwind CSS</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Server size={18} className="text-primary" />
                  <div>
                    <p className="font-medium text-sm">Backend</p>
                    <p className="text-xs text-muted-foreground">Node.js, Express</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Database size={18} className="text-primary" />
                  <div>
                    <p className="font-medium text-sm">Database</p>
                    <p className="text-xs text-muted-foreground">MongoDB, Redis</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Code size={18} className="text-primary" />
                  <div>
                    <p className="font-medium text-sm">APIs</p>
                    <p className="text-xs text-muted-foreground">RESTful, GraphQL</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="glass">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Version Control</h3>
              <div className="space-y-2">
                <div className="p-4 border border-border rounded-lg">
                  <div className="flex items-center space-x-2">
                    <GitBranch size={18} className="text-primary" />
                    <span className="font-medium text-sm">main</span>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    <p>Last commit: 2 hours ago</p>
                    <p>Author: Norman Smith</p>
                  </div>
                </div>
                
                <Button
                  variant="outline"
                  className="w-full"
                  icon={<GitBranch size={18} />}
                >
                  Create New Branch
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default IntegrationPanel;
