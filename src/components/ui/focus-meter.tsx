import React from 'react';
import { cn } from '@/lib/utils';

interface FocusMeterProps {
  value: number;
  className?: string;
}

export function FocusMeter({ value, className }: FocusMeterProps) {
  // Ensure value is between 0 and 100
  const safeValue = Math.min(100, Math.max(0, value));
  
  // Calculate segments
  const segments = 10;
  const filledSegments = Math.round((safeValue / 100) * segments);
  
  // Get color based on value
  const getColor = (index: number) => {
    if (index >= filledSegments) return 'bg-gray-200 dark:bg-gray-800';
    
    if (safeValue < 30) return 'bg-red-500';
    if (safeValue < 50) return 'bg-orange-500';
    if (safeValue < 70) return 'bg-yellow-500';
    if (safeValue < 90) return 'bg-green-500';
    return 'bg-emerald-500';
  };
  
  return (
    <div className={cn('flex flex-col space-y-2', className)}>
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Focus Score</span>
        <span className="text-sm font-bold">{Math.round(safeValue)}%</span>
      </div>
      <div className="flex space-x-1">
        {Array.from({ length: segments }).map((_, i) => (
          <div 
            key={i}
            className={cn(
              'flex-1 h-2 rounded-full transition-colors duration-300',
              getColor(i)
            )}
          />
        ))}
      </div>
    </div>
  );
}