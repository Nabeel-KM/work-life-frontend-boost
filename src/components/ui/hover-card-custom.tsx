import React from 'react';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { cn } from '@/lib/utils';

interface HoverCardCustomProps {
  trigger: React.ReactNode;
  content: React.ReactNode;
  className?: string;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
}

export function HoverCardCustom({
  trigger,
  content,
  className,
  side = "right",
  align = "center"
}: HoverCardCustomProps) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div>{trigger}</div>
      </HoverCardTrigger>
      <HoverCardContent 
        side={side} 
        align={align}
        className={cn(
          "p-4 max-w-xs bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-lg rounded-lg",
          className
        )}
      >
        {content}
      </HoverCardContent>
    </HoverCard>
  );
}