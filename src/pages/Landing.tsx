
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Brain, 
  ArrowRight, 
  Code, 
  Workflow, 
  LineChart, 
  Settings,
  Sparkles,
  Zap
} from 'lucide-react';
import Button from '@/components/common/Button';

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-background to-secondary py-20 px-6 md:px-12 lg:px-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <div className="inline-block px-4 py-1.5 bg-primary/10 rounded-full">
                <span className="text-sm font-medium text-primary">
                  AI Development Orchestration
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Build, Deploy, and Manage AI Agents with
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Luna</span>
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-lg">
                An all-in-one desktop application for developing, fine-tuning, and deploying AI agents with automated workflows.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/app">
                  <Button 
                    variant="primary" 
                    size="lg"
                    icon={<ArrowRight size={18} />}
                  >
                    Start Building Now
                  </Button>
                </Link>
                
                <Button 
                  variant="outline" 
                  size="lg"
                >
                  Watch Demo
                </Button>
              </div>
            </div>
            
            <div className="relative rounded-xl p-2">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl opacity-20 blur-xl animate-pulse-slow"></div>
              <img 
                src="/lovable-uploads/68ca9d66-c2ef-4e4e-8ff9-a87c0fe7c58c.png" 
                alt="Luna AI Platform" 
                className="relative w-full max-w-md mx-auto rounded-lg shadow-2xl animate-float"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 px-6 md:px-12 lg:px-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">All-in-One AI Development Platform</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to build, fine-tune, and deploy AI agents, all in one desktop application.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard 
              icon={<Brain className="text-blue-500" />}
              title="AI Framework Building"
              description="Construct AI frameworks with a visual interface, similar to SmythOS."
            />
            
            <FeatureCard 
              icon={<Workflow className="text-purple-500" />}
              title="Visual Workflows"
              description="Create complex workflows and data pipelines like Langflow."
            />
            
            <FeatureCard 
              icon={<Settings className="text-green-500" />}
              title="AI Fine-Tuning"
              description="Fine-tune AI models for your specific use cases like DIfy.AI."
            />
            
            <FeatureCard 
              icon={<Code className="text-amber-500" />}
              title="Frontend & Backend Integration"
              description="Seamlessly integrate frontend and backend like GPT-Engineer."
            />
          </div>
        </div>
      </section>
      
      {/* Advanced Features */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Advanced Features</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful capabilities to enhance your AI development workflow.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AdvancedFeatureCard 
              icon={<Sparkles className="text-yellow-500" />}
              title="AI Assist Recommendations"
              description="Get intelligent suggestions for optimizing workflows and selecting the right parameters for fine-tuning."
            />
            
            <AdvancedFeatureCard 
              icon={<LineChart className="text-blue-500" />}
              title="Performance Monitoring"
              description="Real-time charts for CPU, memory, and API call usage with a dynamic visual dashboard."
            />
            
            <AdvancedFeatureCard 
              icon={<Zap className="text-purple-500" />}
              title="Debugging Assistant"
              description="AI-guided debugging that highlights problematic nodes and suggests improvements."
            />
            
            <AdvancedFeatureCard 
              icon={<Code className="text-green-500" />}
              title="Version Control"
              description="Version your workflows, frameworks, and fine-tuned models for easy rollback and experimentation."
            />
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your AI Development Process?</h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Start building AI agents with Luna's automated orchestration platform today.
          </p>
          
          <Link to="/app">
            <Button 
              variant="secondary" 
              size="lg"
              className="bg-white text-primary hover:bg-white/90"
            >
              Launch Luna
            </Button>
          </Link>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-10 px-6 md:px-12 lg:px-24 border-t">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-6 md:mb-0">
              <img 
                src="/lovable-uploads/68ca9d66-c2ef-4e4e-8ff9-a87c0fe7c58c.png" 
                alt="Luna Logo" 
                className="w-10 h-10 rounded-full mr-3" 
              />
              <div>
                <div className="font-bold text-lg">Luna AI</div>
                <div className="text-xs text-muted-foreground">by Norman dela Paz Tabora</div>
              </div>
            </div>
            
            <div className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} LunaTech AI Development. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ icon, title, description }) => {
  return (
    <div className="glass-card rounded-xl p-6 transition-all duration-300 hover:translate-y-[-5px]">
      <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

const AdvancedFeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ icon, title, description }) => {
  return (
    <div className="flex items-start space-x-4 p-6 rounded-xl border hover:border-primary/20 transition-all duration-300">
      <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};

export default Landing;
