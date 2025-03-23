
import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className, 
  onClick,
  hover = true
}) => {
  return (
    <div 
      className={cn(
        "rounded-xl p-6 animate-fade-in backdrop-blur-sm",
        hover ? "transition-all duration-300 hover:shadow-md" : "",
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;
