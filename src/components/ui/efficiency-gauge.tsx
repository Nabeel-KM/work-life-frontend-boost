import React from 'react';
import { cn } from '@/lib/utils';

interface EfficiencyGaugeProps {
  value: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
}

export function EfficiencyGauge({ 
  value, 
  size = 'md', 
  className,
  label
}: EfficiencyGaugeProps) {
  // Ensure value is between 0 and 100
  const safeValue = Math.min(100, Math.max(0, value));
  
  // Calculate color based on value
  const getColor = () => {
    if (safeValue < 30) return 'from-red-500 to-orange-500';
    if (safeValue < 70) return 'from-yellow-500 to-orange-500';
    return 'from-green-500 to-emerald-500';
  };
  
  // Size classes
  const sizeClasses = {
    sm: 'w-16 h-16 text-xs',
    md: 'w-24 h-24 text-sm',
    lg: 'w-32 h-32 text-base'
  };
  
  // Calculate the angle for the gauge needle
  const angle = (safeValue / 100) * 180 - 90;
  
  return (
    <div className={cn('flex flex-col items-center', className)}>
      {label && <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">{label}</div>}
      <div className={cn('relative', sizeClasses[size])}>
        {/* Background semi-circle */}
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-white dark:bg-gray-900"></div>
        </div>
        
        {/* Colored progress arc */}
        <div 
          className={cn(
            "absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-r",
            getColor()
          )}
          style={{ 
            clipPath: `polygon(0% 100%, 100% 100%, 100% ${100 - safeValue}%, 0% ${100 - safeValue}%)` 
          }}
        ></div>
        
        {/* Needle */}
        <div 
          className="absolute bottom-0 left-1/2 w-1 bg-gray-900 dark:bg-white origin-bottom transform -translate-x-1/2"
          style={{ 
            height: '45%',
            transform: `translateX(-50%) rotate(${angle}deg)`
          }}
        ></div>
        
        {/* Center point */}
        <div className="absolute bottom-0 left-1/2 w-3 h-3 bg-gray-900 dark:bg-white rounded-full transform -translate-x-1/2 translate-y-1/2"></div>
        
        {/* Value text */}
        <div className="absolute bottom-0 left-0 right-0 text-center pb-1">
          <span className="font-bold">{Math.round(safeValue)}%</span>
        </div>
      </div>
    </div>
  );
}