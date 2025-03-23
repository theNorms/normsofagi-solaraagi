
import React from 'react';
import { cn } from '@/lib/utils';

interface AnimatedTransitionProps {
  children: React.ReactNode;
  show: boolean;
  className?: string;
  type?: 'fade' | 'scale' | 'slide';
  duration?: 'fast' | 'normal' | 'slow';
  unmountOnExit?: boolean;
}

const AnimatedTransition: React.FC<AnimatedTransitionProps> = ({
  children,
  show,
  className,
  type = 'fade',
  duration = 'normal',
  unmountOnExit = true,
}) => {
  const [mounted, setMounted] = React.useState(show);
  const [animationComplete, setAnimationComplete] = React.useState(!show);

  React.useEffect(() => {
    if (show) setMounted(true);
    
    const timer = setTimeout(() => {
      setAnimationComplete(!show);
    }, duration === 'fast' ? 150 : duration === 'slow' ? 500 : 300);
    
    return () => clearTimeout(timer);
  }, [show, duration]);

  React.useEffect(() => {
    if (animationComplete && !show && unmountOnExit) {
      const timer = setTimeout(() => {
        setMounted(false);
      }, 50);
      
      return () => clearTimeout(timer);
    }
  }, [animationComplete, show, unmountOnExit]);

  if (!mounted) return null;

  const animations = {
    fade: {
      enter: 'animate-fade-in',
      exit: 'animate-fade-out',
    },
    scale: {
      enter: 'animate-scale-in',
      exit: 'animate-scale-out',
    },
    slide: {
      enter: 'animate-slide-in',
      exit: 'animate-slide-out',
    },
  };

  const durationStyles = {
    fast: 'duration-150',
    normal: 'duration-300',
    slow: 'duration-500',
  };

  return (
    <div
      className={cn(
        "transition-all",
        show ? animations[type].enter : animations[type].exit,
        durationStyles[duration],
        className
      )}
    >
      {children}
    </div>
  );
};

export default AnimatedTransition;
