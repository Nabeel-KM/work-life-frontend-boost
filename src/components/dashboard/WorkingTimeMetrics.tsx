import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EfficiencyGauge } from '@/components/ui/efficiency-gauge';
import { formatMinutesToTime, formatHours } from '@/lib/utils-time';
import { Clock, Activity } from 'lucide-react';

interface WorkingTimeMetricsProps {
  sessionTime: number;
  workingTime: number;
  activeTime: number;
  className?: string;
}

export function WorkingTimeMetrics({
  sessionTime,
  workingTime,
  activeTime,
  className
}: WorkingTimeMetricsProps) {
  // Ensure values are valid numbers
  const safeSessionTime = isNaN(sessionTime) ? 0 : sessionTime;
  const safeWorkingTime = isNaN(workingTime) ? 0 : workingTime;
  const safeActiveTime = isNaN(activeTime) ? 0 : activeTime;
  
  // Calculate efficiency percentage - working time is now in hours, active time still in minutes
  const efficiency = safeWorkingTime > 0 ? Math.round((safeActiveTime / 60) / safeWorkingTime * 100) : 0;
  
  return (
    <Card className={`bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50 shadow-xl ${className}`}>
      <CardHeader className="pb-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 rounded-t-lg">
        <CardTitle className="text-xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 dark:from-white dark:to-blue-200 bg-clip-text text-transparent">
          Working Time Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center p-3 rounded-md bg-blue-50/50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900">
                <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400 mb-1" />
                <div className="text-xs text-gray-600 dark:text-gray-400">Working Time</div>
                <div className="text-lg font-bold">{formatHours(safeWorkingTime)}</div>
              </div>
              
              <div className="flex flex-col items-center p-3 rounded-md bg-green-50/50 dark:bg-green-950/30 border border-green-100 dark:border-green-900">
                <Activity className="h-5 w-5 text-green-600 dark:text-green-400 mb-1" />
                <div className="text-xs text-gray-600 dark:text-gray-400">Active Time</div>
                <div className="text-lg font-bold">{formatMinutesToTime(safeActiveTime)}</div>
              </div>
            </div>
            
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium">Efficiency</div>
                <div className="text-sm font-medium">{efficiency}%</div>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-600 to-indigo-600"
                  style={{ width: `${Math.min(100, efficiency)}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
                Active time vs working time
              </div>
            </div>
          </div>
          
          <div className="flex-1 flex justify-center">
            <EfficiencyGauge 
              value={efficiency} 
              size="lg" 
              label="Work Efficiency" 
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}