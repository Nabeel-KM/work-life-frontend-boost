import React from 'react';
import { cn } from '@/lib/utils';
import { Badge } from './badge';

interface AppUsage {
  app: string;
  duration: number;
}

interface AppUsageListProps {
  productiveApps?: AppUsage[];
  distractingApps?: AppUsage[];
  className?: string;
}

export function AppUsageList({ 
  productiveApps = [], 
  distractingApps = [],
  className 
}: AppUsageListProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {productiveApps.length > 0 && (
        <div>
          <div className="flex items-center mb-2">
            <h4 className="text-sm font-medium">Productive Applications</h4>
            <Badge variant="success" size="sm" className="ml-2">Productive</Badge>
          </div>
          <div className="space-y-2">
            {productiveApps.map((app, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-2 rounded-md bg-green-50/50 dark:bg-green-950/30 border border-green-100 dark:border-green-900"
              >
                <span className="text-sm font-medium truncate max-w-[70%]">{app.app}</span>
                <span className="text-xs text-gray-600 dark:text-gray-400">{formatDuration(app.duration)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {distractingApps.length > 0 && (
        <div>
          <div className="flex items-center mb-2">
            <h4 className="text-sm font-medium">Distracting Applications</h4>
            <Badge variant="warning" size="sm" className="ml-2">Distracting</Badge>
          </div>
          <div className="space-y-2">
            {distractingApps.map((app, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-2 rounded-md bg-yellow-50/50 dark:bg-yellow-950/30 border border-yellow-100 dark:border-yellow-900"
              >
                <span className="text-sm font-medium truncate max-w-[70%]">{app.app}</span>
                <span className="text-xs text-gray-600 dark:text-gray-400">{formatDuration(app.duration)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {productiveApps.length === 0 && distractingApps.length === 0 && (
        <div className="text-center py-4 text-gray-500 dark:text-gray-400">
          No application data available
        </div>
      )}
    </div>
  );
}

function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${Math.round(minutes)} min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return `${hours}h ${mins}m`;
}