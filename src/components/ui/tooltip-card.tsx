import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from '@/lib/utils';

interface TooltipCardProps {
  trigger: React.ReactNode;
  content: React.ReactNode;
  className?: string;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
}

export function TooltipCard({
  trigger,
  content,
  className,
  side = "top",
  align = "center"
}: TooltipCardProps) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <div className="cursor-help">{trigger}</div>
        </TooltipTrigger>
        <TooltipContent 
          side={side} 
          align={align}
          className={cn(
            "p-4 max-w-xs bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-lg rounded-lg",
            className
          )}
        >
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}