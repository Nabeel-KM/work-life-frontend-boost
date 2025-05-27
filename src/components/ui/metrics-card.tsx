import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { ProductivityGauge } from './productivity-gauge';
import { FocusMeter } from './focus-meter';
import { AppUsageList } from './app-usage-list';
import { Clock, Activity, Coffee } from 'lucide-react';

interface MetricsCardProps {
  productivityScore: number;
  focusScore: number;
  breakCount: number;
  avgSessionLength: number;
  productiveApps: Array<{ app: string; duration: number }>;
  distractingApps: Array<{ app: string; duration: number }>;
  className?: string;
}

export function MetricsCard({
  productivityScore = 0,
  focusScore = 0,
  breakCount = 0,
  avgSessionLength = 0,
  productiveApps = [],
  distractingApps = [],
  className
}: MetricsCardProps) {
  // Ensure values are valid numbers
  const safeProductivityScore = isNaN(productivityScore) ? 0 : productivityScore;
  const safeFocusScore = isNaN(focusScore) ? 0 : focusScore;
  const safeBreakCount = isNaN(breakCount) ? 0 : breakCount;
  const safeAvgSessionLength = isNaN(avgSessionLength) ? 0 : avgSessionLength;
  
  // Ensure arrays are valid
  const safeProductiveApps = Array.isArray(productiveApps) ? productiveApps : [];
  const safeDistractingApps = Array.isArray(distractingApps) ? distractingApps : [];

  return (
    <Card className={cn('bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50 shadow-xl', className)}>
      <CardHeader className="pb-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 rounded-t-lg">
        <CardTitle className="text-xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 dark:from-white dark:to-blue-200 bg-clip-text text-transparent">
          Productivity Metrics
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="flex justify-center">
              <ProductivityGauge 
                value={safeProductivityScore} 
                size="lg" 
                label="Productivity Score" 
              />
            </div>
            
            <div className="space-y-4">
              <FocusMeter value={safeFocusScore} />
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="flex items-center p-3 rounded-md bg-blue-50/50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900">
                  <Coffee className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                  <div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Breaks Taken</div>
                    <div className="text-lg font-bold">{safeBreakCount}</div>
                  </div>
                </div>
                
                <div className="flex items-center p-3 rounded-md bg-purple-50/50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900">
                  <Clock className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-2" />
                  <div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Avg Session</div>
                    <div className="text-lg font-bold">{safeAvgSessionLength.toFixed(1)}h</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <AppUsageList 
              productiveApps={safeProductiveApps} 
              distractingApps={safeDistractingApps} 
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}