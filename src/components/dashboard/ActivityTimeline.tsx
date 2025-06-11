
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity } from 'lucide-react';
import { UserData } from '@/lib/api';

interface ActivityTimelineProps {
  users: UserData[];
}

const ActivityTimeline = ({ users }: ActivityTimelineProps) => {
  // Generate hourly activity data (mock data for demonstration)
  const generateHourlyData = () => {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    return hours.map(hour => {
      // Simulate activity levels based on typical work hours
      let activityLevel = 0;
      if (hour >= 9 && hour <= 17) {
        activityLevel = Math.random() * 0.8 + 0.2; // 20-100% during work hours
      } else if (hour >= 18 && hour <= 22) {
        activityLevel = Math.random() * 0.4; // 0-40% in evening
      }
      
      return {
        hour,
        activity: activityLevel,
        status: activityLevel > 0.6 ? 'active' : activityLevel > 0.2 ? 'idle' : 'away'
      };
    });
  };

  const hourlyData = generateHourlyData();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'idle': return 'bg-yellow-500';
      case 'away': return 'bg-red-300';
      default: return 'bg-gray-200';
    }
  };

  return (
    <Card className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-gray-200/50 dark:border-gray-700/50 shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
            <Activity className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold">Daily Activity Timeline</CardTitle>
            <CardDescription>Hourly productivity overview for today</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Timeline Chart */}
          <div className="flex items-end gap-1 h-32 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
            {hourlyData.map((data, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className={`w-full rounded-t transition-all duration-300 hover:opacity-80 ${getStatusColor(data.status)}`}
                  style={{ height: `${data.activity * 100}%` }}
                  title={`${data.hour}:00 - ${data.status} (${Math.round(data.activity * 100)}%)`}
                />
                {index % 3 === 0 && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {data.hour}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span className="text-gray-600 dark:text-gray-400">Active</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded"></div>
              <span className="text-gray-600 dark:text-gray-400">Idle</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-300 rounded"></div>
              <span className="text-gray-600 dark:text-gray-400">Away</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityTimeline;
