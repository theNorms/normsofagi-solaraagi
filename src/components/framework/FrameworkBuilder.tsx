
import React, { useState } from 'react';
import { Plus, Save, Code, Copy, FileJson } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import Input from '../common/Input';
import AnimatedTransition from '../common/AnimatedTransition';

interface FrameworkSection {
  id: string;
  title: string;
  content: string;
}

const FrameworkBuilder: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [frameworkName, setFrameworkName] = useState('');
  const [frameworkSections, setFrameworkSections] = useState<FrameworkSection[]>([
    { id: '1', title: 'Personality Traits', content: '' },
    { id: '2', title: 'Capabilities', content: '' },
    { id: '3', title: 'Limitations', content: '' },
  ]);
  const [showJsonView, setShowJsonView] = useState(false);

  const addSection = () => {
    const newSection = {
      id: Date.now().toString(),
      title: 'New Section',
      content: '',
    };
    setFrameworkSections([...frameworkSections, newSection]);
  };

  const updateSection = (id: string, field: 'title' | 'content', value: string) => {
    setFrameworkSections(
      frameworkSections.map((section) =>
        section.id === id ? { ...section, [field]: value } : section
      )
    );
  };

  const deleteSection = (id: string) => {
    setFrameworkSections(frameworkSections.filter((section) => section.id !== id));
  };

  const generateFrameworkJson = () => {
    const framework = {
      name: frameworkName,
      apiKey: apiKey,
      sections: frameworkSections.reduce(
        (acc, section) => ({
          ...acc,
          [section.title]: section.content,
        }),
        {}
      ),
    };
    return JSON.stringify(framework, null, 2);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateFrameworkJson());
    // In a real app, we would show a toast notification here
  };

  return (
    <div className="h-full flex flex-col space-y-6 p-6 overflow-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">AI Framework Builder</h2>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={() => setShowJsonView(!showJsonView)}
            icon={showJsonView ? <Code size={18} /> : <FileJson size={18} />}
          >
            {showJsonView ? 'Builder View' : 'JSON View'}
          </Button>
          <Button 
            variant="primary"
            icon={<Save size={18} />}
          >
            Save Framework
          </Button>
        </div>
      </div>

      <AnimatedTransition show={!showJsonView} type="fade">
        <div className="space-y-6">
          <Card className="glass">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Framework Name"
                  value={frameworkName}
                  onChange={(e) => setFrameworkName(e.target.value)}
                  placeholder="My AI Assistant"
                />
                <Input
                  label="API Key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-..."
                  type="password"
                />
              </div>
            </div>
          </Card>

          <div className="space-y-4">
            {frameworkSections.map((section) => (
              <Card key={section.id} className="glass">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Input
                      value={section.title}
                      onChange={(e) => updateSection(section.id, 'title', e.target.value)}
                      className="font-medium"
                    />
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => deleteSection(section.id)}
                    >
                      Remove
                    </Button>
                  </div>
                  <textarea
                    value={section.content}
                    onChange={(e) => updateSection(section.id, 'content', e.target.value)}
                    placeholder={`Describe the ${section.title.toLowerCase()}...`}
                    className="w-full min-h-[120px] p-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </Card>
            ))}

            <Button 
              onClick={addSection} 
              variant="outline" 
              className="w-full"
              icon={<Plus size={18} />}
            >
              Add Section
            </Button>
          </div>

          <Card className="glass">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Generate</h3>
              <p className="text-muted-foreground">
                Once you've configured your framework, you can generate your AI agent.
              </p>
              <Button 
                variant="primary" 
                className="w-full"
              >
                Generate AI Agent
              </Button>
            </div>
          </Card>
        </div>
      </AnimatedTransition>

      <AnimatedTransition show={showJsonView} type="fade">
        <Card className="glass">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Framework JSON</h3>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={copyToClipboard}
                icon={<Copy size={18} />}
              >
                Copy
              </Button>
            </div>
            <pre className="bg-secondary p-4 rounded-md overflow-auto max-h-[500px] text-sm">
              {generateFrameworkJson()}
            </pre>
          </div>
        </Card>
      </AnimatedTransition>
    </div>
  );
};

export default FrameworkBuilder;
