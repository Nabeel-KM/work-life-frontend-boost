import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { UserMetrics } from '@/lib/api';

interface DebugMetricsProps {
  metrics: UserMetrics;
}

export function DebugMetrics({ metrics }: DebugMetricsProps) {
  return (
    <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50 shadow-xl">
      <CardHeader className="pb-4 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/50 dark:to-orange-950/50 rounded-t-lg">
        <CardTitle className="text-xl font-bold">Debug Metrics Data</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-auto text-xs">
          {JSON.stringify(metrics, null, 2)}
        </pre>
      </CardContent>
    </Card>
  );
}