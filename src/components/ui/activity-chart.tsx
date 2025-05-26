import React from 'react';

interface ActivityChartProps {
  data: number[];
  height?: number;
  className?: string;
}

export function ActivityChart({ data, height = 40, className }: ActivityChartProps) {
  const max = Math.max(...data, 1);
  
  return (
    <div 
      className={`w-full flex items-end gap-[2px] ${className}`}
      style={{ height: `${height}px` }}
    >
      {data.map((value, index) => {
        const percentage = (value / max) * 100;
        const barHeight = Math.max(percentage, 5); // Minimum height of 5%
        
        return (
          <div
            key={index}
            className="flex-1 bg-gradient-to-t from-blue-500 to-indigo-500 dark:from-blue-600 dark:to-indigo-600 rounded-t-sm hover:from-blue-600 hover:to-indigo-700 transition-all duration-200"
            style={{ height: `${barHeight}%` }}
            title={`${value} minutes`}
          />
        );
      })}
    </div>
  );
}