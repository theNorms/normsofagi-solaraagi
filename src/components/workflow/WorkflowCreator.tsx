import React, { useState } from 'react';
import { Plus, Save, Workflow, Database, MessageCircle, FileText, ArrowRight } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import Input from '../common/Input';

interface Node {
  id: string;
  type: 'input' | 'process' | 'output';
  label: string;
  x: number;
  y: number;
}

interface Connection {
  id: string;
  source: string;
  target: string;
}

const WorkflowCreator: React.FC = () => {
  const [workflowName, setWorkflowName] = useState('');
  const [nodes, setNodes] = useState<Node[]>([
    { id: '1', type: 'input', label: 'User Input', x: 100, y: 100 },
    { id: '2', type: 'process', label: 'Process Data', x: 300, y: 100 },
    { id: '3', type: 'output', label: 'Generate Response', x: 500, y: 100 },
  ]);
  const [connections, setConnections] = useState<Connection[]>([
    { id: 'c1', source: '1', target: '2' },
    { id: 'c2', source: '2', target: '3' },
  ]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const addNode = (type: 'input' | 'process' | 'output') => {
    const newNode: Node = {
      id: Date.now().toString(),
      type,
      label: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Node`,
      x: 300,
      y: 200,
    };
    setNodes([...nodes, newNode]);
  };

  const updateNodeLabel = (id: string, label: string) => {
    setNodes(
      nodes.map((node) => (node.id === id ? { ...node, label } : node))
    );
  };

  const deleteNode = (id: string) => {
    setNodes(nodes.filter((node) => node.id !== id));
    setConnections(
      connections.filter(
        (conn) => conn.source !== id && conn.target !== id
      )
    );
  };

  const selectNode = (id: string) => {
    setSelectedNode(id === selectedNode ? null : id);
  };

  return (
    <div className="h-full flex flex-col space-y-6 p-6 overflow-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Workflow Creator</h2>
        <Button 
          variant="primary"
          icon={<Save size={18} />}
        >
          Save Workflow
        </Button>
      </div>

      <Card className="glass">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Workflow Information</h3>
          <Input
            label="Workflow Name"
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
            placeholder="My Workflow"
          />
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-1">
          <Card className="glass h-full">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Add Nodes</h3>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => addNode('input')}
                  icon={<MessageCircle size={18} />}
                >
                  Input Node
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => addNode('process')}
                  icon={<Database size={18} />}
                >
                  Process Node
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => addNode('output')}
                  icon={<FileText size={18} />}
                >
                  Output Node
                </Button>
              </div>
            </div>
          </Card>
        </div>

        <div className="md:col-span-3">
          <Card className="glass h-full min-h-[400px] relative">
            <div className="absolute inset-0 p-6">
              <svg className="w-full h-full absolute top-0 left-0 pointer-events-none">
                {connections.map((connection) => {
                  const source = nodes.find((n) => n.id === connection.source);
                  const target = nodes.find((n) => n.id === connection.target);
                  
                  if (!source || !target) return null;
                  
                  return (
                    <g key={connection.id}>
                      <line
                        x1={source.x + 75}
                        y1={source.y + 30}
                        x2={target.x + 75}
                        y2={target.y + 30}
                        stroke="#4d7dff"
                        strokeWidth={2}
                        markerEnd="url(#arrowhead)"
                      />
                      <defs>
                        <marker
                          id="arrowhead"
                          markerWidth="10"
                          markerHeight="7"
                          refX="9"
                          refY="3.5"
                          orient="auto"
                        >
                          <polygon points="0 0, 10 3.5, 0 7" fill="#4d7dff" />
                        </marker>
                      </defs>
                    </g>
                  );
                })}
              </svg>
              
              {nodes.map((node) => (
                <div
                  key={node.id}
                  className={`absolute p-4 rounded-lg w-[150px] cursor-pointer transition-all ${
                    selectedNode === node.id
                      ? 'ring-2 ring-primary'
                      : 'hover:ring-1 hover:ring-primary/50'
                  } ${
                    node.type === 'input'
                      ? 'bg-blue-100 border border-blue-200'
                      : node.type === 'process'
                      ? 'bg-purple-100 border border-purple-200'
                      : 'bg-green-100 border border-green-200'
                  }`}
                  style={{
                    top: `${node.y}px`,
                    left: `${node.x}px`,
                  }}
                  onClick={() => selectNode(node.id)}
                >
                  <div className="text-center">
                    {node.type === 'input' && <MessageCircle size={20} className="mx-auto mb-2" />}
                    {node.type === 'process' && <Database size={20} className="mx-auto mb-2" />}
                    {node.type === 'output' && <FileText size={20} className="mx-auto mb-2" />}
                    <div className="font-medium text-sm">{node.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {selectedNode && (
        <Card className="glass">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Node Properties</h3>
            <div className="space-y-4">
              {nodes
                .filter((node) => node.id === selectedNode)
                .map((node) => (
                  <div key={node.id} className="space-y-4">
                    <Input
                      label="Label"
                      value={node.label}
                      onChange={(e) => updateNodeLabel(node.id, e.target.value)}
                    />
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        className="flex-1"
                      >
                        Configure
                      </Button>
                      <Button 
                        variant="outline" 
                        className="flex-1 text-destructive"
                        onClick={() => deleteNode(node.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default WorkflowCreator;
