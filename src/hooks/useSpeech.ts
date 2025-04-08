
import { useState, useEffect, useCallback } from 'react';
import { speechManager } from '@/utils/voiceUtils';

export const useSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    // Set up speech callbacks
    speechManager.onStart(() => {
      setIsSpeaking(true);
      setIsPaused(false);
    });

    speechManager.onEnd(() => {
      setIsSpeaking(false);
      setIsPaused(false);
    });

    // Cleanup on unmount
    return () => {
      speechManager.stop();
    };
  }, []);

  const speak = useCallback((text: string) => {
    speechManager.speak(text);
  }, []);

  const stop = useCallback(() => {
    speechManager.stop();
  }, []);

  const togglePause = useCallback(() => {
    speechManager.togglePause();
    setIsPaused(speechManager.isCurrentlyPaused());
    setIsSpeaking(speechManager.isCurrentlySpeaking());
  }, []);

  return {
    speak,
    stop,
    togglePause,
    isSpeaking,
    isPaused
  };
};

export default useSpeech;
