
import React, { useState } from 'react';
import { Upload, File, Save, BarChart2, Play, FileText, Database, Check } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import Input from '../common/Input';

const FineTuner: React.FC = () => {
  const [modelName, setModelName] = useState('');
  const [trainingFile, setTrainingFile] = useState<File | null>(null);
  const [baseModel, setBaseModel] = useState('gpt-3.5-turbo');
  const [epochs, setEpochs] = useState('3');
  const [learningRate, setLearningRate] = useState('0.0001');
  const [trainingStatus, setTrainingStatus] = useState<'idle' | 'training' | 'completed'>('idle');
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setTrainingFile(e.target.files[0]);
    }
  };

  const startTraining = () => {
    setTrainingStatus('training');
    setProgress(0);
    
    // Simulate training progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTrainingStatus('completed');
          return 100;
        }
        return prev + 10;
      });
    }, 1000);
  };

  return (
    <div className="h-full flex flex-col space-y-6 p-6 overflow-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">AI Fine-Tuning</h2>
        <Button 
          variant="primary"
          icon={<Save size={18} />}
        >
          Save Configuration
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card className="glass">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Training Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Model Name"
                  value={modelName}
                  onChange={(e) => setModelName(e.target.value)}
                  placeholder="My Fine-Tuned Model"
                />
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">Base Model</label>
                  <select
                    value={baseModel}
                    onChange={(e) => setBaseModel(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                    <option value="gpt-4">GPT-4</option>
                    <option value="llama-2">Llama 2</option>
                    <option value="mistral-7b">Mistral 7B</option>
                  </select>
                </div>
              </div>
            </div>
          </Card>

          <Card className="glass">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Training Data</h3>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                {trainingFile ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-center">
                      <File size={28} className="text-primary" />
                    </div>
                    <p className="font-medium">{trainingFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(trainingFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setTrainingFile(null)}
                    >
                      Remove File
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center">
                      <Upload size={28} className="text-muted-foreground" />
                    </div>
                    <div className="space-y-2">
                      <p className="font-medium">Upload Training Data</p>
                      <p className="text-sm text-muted-foreground">
                        Drag and drop a file or click to browse
                      </p>
                    </div>
                    <Input
                      type="file"
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload">
                      <Button variant="outline" className="cursor-pointer">
                        Choose File
                      </Button>
                    </label>
                  </div>
                )}
              </div>
            </div>
          </Card>

          <Card className="glass">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Hyperparameters</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Epochs"
                  type="number"
                  value={epochs}
                  onChange={(e) => setEpochs(e.target.value)}
                  min="1"
                  max="10"
                />
                <Input
                  label="Learning Rate"
                  type="number"
                  value={learningRate}
                  onChange={(e) => setLearningRate(e.target.value)}
                  min="0.00001"
                  max="0.01"
                  step="0.00001"
                />
              </div>
            </div>
          </Card>

          <Card className="glass">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Training Controls</h3>
              <div className="space-y-4">
                {trainingStatus === 'training' && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Training Progress</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Training in progress. This may take several minutes.
                    </p>
                  </div>
                )}
                
                {trainingStatus === 'completed' && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
                    <Check size={18} className="text-green-500" />
                    <span>Training completed successfully!</span>
                  </div>
                )}
                
                <div className="flex space-x-2">
                  <Button
                    variant="primary"
                    className="flex-1"
                    disabled={!trainingFile || trainingStatus === 'training' || !modelName}
                    onClick={startTraining}
                    loading={trainingStatus === 'training'}
                    icon={<Play size={18} />}
                  >
                    Start Training
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="glass">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Model Registry</h3>
              <div className="space-y-2">
                <div className="p-4 border border-border rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Database size={18} className="text-primary" />
                    <span className="font-medium">gpt-3.5-custom-1</span>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    <p>Base: GPT-3.5 Turbo</p>
                    <p>Created: 3 days ago</p>
                  </div>
                </div>
                
                <div className="p-4 border border-border rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Database size={18} className="text-primary" />
                    <span className="font-medium">customer-support-gpt</span>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    <p>Base: GPT-4</p>
                    <p>Created: 1 week ago</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="glass">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Evaluation Metrics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Loss</span>
                  <span className="text-sm font-medium">0.0342</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '70%' }}></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm">Accuracy</span>
                  <span className="text-sm font-medium">94.8%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '94.8%' }}></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm">Perplexity</span>
                  <span className="text-sm font-medium">3.21</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="glass">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Documentation</h3>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  icon={<FileText size={18} />}
                >
                  Fine-Tuning Guide
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  icon={<BarChart2 size={18} />}
                >
                  Evaluation Best Practices
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FineTuner;
