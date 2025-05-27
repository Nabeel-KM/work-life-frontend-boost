import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Clock, Activity } from 'lucide-react';
import { formatMinutesToTime, formatHours } from '@/lib/utils-time';

interface WorkingTimeCardProps {
  sessionTime: number;
  workingTime: number;
  activeTime: number;
  className?: string;
}

export function WorkingTimeCard({
  sessionTime,
  workingTime,
  activeTime,
  className
}: WorkingTimeCardProps) {
  // Ensure values are valid numbers with explicit console logging
  console.log("WorkingTimeCard received:", { sessionTime, workingTime, activeTime });
  
  const safeSessionTime = isNaN(sessionTime) ? 0 : Number(sessionTime);
  const safeWorkingTime = isNaN(workingTime) ? 0 : Number(workingTime);
  const safeActiveTime = isNaN(activeTime) ? 0 : Number(activeTime);
  
  // Calculate efficiency percentage based on active time vs working time
  console.log("Calculating efficiency with:", { safeActiveTime, safeWorkingTime });
  
  // If working time is very small but active time exists, set efficiency to 100%
  let efficiency = 0;
  if (safeWorkingTime > 0) {
    if (safeActiveTime > 0 && safeWorkingTime < 0.1) {
      efficiency = 100;
    } else {
      // Working time is now in hours, active time in minutes
      efficiency = Math.min(100, Math.round(safeActiveTime / (safeWorkingTime * 60) * 100));
    }
  }
  
  return (
    <Card className={cn('bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50 shadow-xl', className)}>
      <CardHeader className="pb-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 rounded-t-lg">
        <CardTitle className="text-xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 dark:from-white dark:to-blue-200 bg-clip-text text-transparent">
          Working Time Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200/50 dark:border-blue-800/50 p-4 rounded-md shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center mb-2">
              <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Session Duration</div>
            </div>
            <div className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 dark:from-white dark:to-blue-200 bg-clip-text text-transparent">
              {safeSessionTime > 0 ? formatHours(safeSessionTime) : "0h"}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Total time from first login to last logout
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50/50 to-violet-50/50 dark:from-purple-950/30 dark:to-violet-950/30 border border-purple-200/50 dark:border-purple-800/50 p-4 rounded-md shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center mb-2">
              <Clock className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-2" />
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Working Time</div>
            </div>
            <div className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-purple-900 dark:from-white dark:to-purple-200 bg-clip-text text-transparent">
              {safeWorkingTime > 0 ? formatHours(safeWorkingTime) : "0h"}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Actual time spent working
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-50/50 to-emerald-50/50 dark:from-green-950/30 dark:to-emerald-950/30 border border-green-200/50 dark:border-green-800/50 p-4 rounded-md shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center mb-2">
              <Activity className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Time</div>
            </div>
            <div className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-green-900 dark:from-white dark:to-green-200 bg-clip-text text-transparent">
              {safeActiveTime > 0 ? formatMinutesToTime(safeActiveTime) : "0m"}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Time actively using applications
            </div>
          </div>
        </div>
        
        <div className="mt-6">
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
            Active time as percentage of working time
          </div>
        </div>
      </CardContent>
    </Card>
  );
}