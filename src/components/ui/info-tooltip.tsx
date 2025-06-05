import React from 'react';
import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface InfoTooltipProps {
  message: string | React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  side?: 'top' | 'right' | 'bottom' | 'left';
}

export function InfoTooltip({ message, size = 'sm', side = 'top' }: InfoTooltipProps) {
  const sizeMap = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };
  
  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <button 
            type="button" 
            className="inline-flex items-center justify-center ml-1 text-muted-foreground hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full"
            aria-label="More information"
          >
            <Info className={`${sizeMap[size]}`} />
          </button>
        </TooltipTrigger>
        <TooltipContent 
          side={side}
          className="bg-primary text-primary-foreground p-3 max-w-xs text-sm" 
        >
          <p>{message}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
