import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonCardProps {
  className?: string;
  rows?: number;
}

export function SkeletonCard({ className, rows = 3 }: SkeletonCardProps) {
  return (
    <div className={cn(
      "rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm p-4 animate-pulse",
      className
    )}>
      <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-800 rounded mb-4"></div>
      {Array(rows).fill(0).map((_, i) => (
        <div key={i} className="space-y-3">
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full"></div>
          {i < rows - 1 && <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6"></div>}
        </div>
      ))}
    </div>
  );
}