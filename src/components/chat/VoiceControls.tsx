
import React from 'react';
import { Volume2, VolumeX, Pause, Play } from 'lucide-react';
import Button from '@/components/common/Button';
import useSpeech from '@/hooks/useSpeech';

interface VoiceControlsProps {
  messageContent: string;
  isPlaying: boolean;
  isPaused: boolean;
  onPlay: () => void;
  onStop: () => void;
  onTogglePause: () => void;
}

const VoiceControls: React.FC<VoiceControlsProps> = ({ 
  messageContent, 
  isPlaying, 
  isPaused, 
  onPlay, 
  onStop,
  onTogglePause 
}) => {
  return (
    <div className="mt-2 flex space-x-1">
      {!isPlaying && !isPaused ? (
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onPlay} 
          icon={<Volume2 size={16} />}
          className="text-xs"
        >
          Listen
        </Button>
      ) : (
        <>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onStop} 
            icon={<VolumeX size={16} />}
            className="text-xs"
          >
            Stop
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onTogglePause} 
            icon={isPaused ? <Play size={16} /> : <Pause size={16} />}
            className="text-xs"
          >
            {isPaused ? 'Resume' : 'Pause'}
          </Button>
        </>
      )}
    </div>
  );
};

export default VoiceControls;
