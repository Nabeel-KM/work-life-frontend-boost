
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUserMetrics } from '@/hooks/use-metrics';
import { User, Calendar, RefreshCw, Activity, Clock } from 'lucide-react';
import StatsCard from '@/components/monitoring/StatsCard';

const UserMetricsCard = () => {
  const [username, setUsername] = useState('');
  const [startDate, setStartDate] = useState(
    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

  const { data: metrics, isLoading, error, fetchMetrics, isEnabled } = useUserMetrics(
    username,
    startDate,
    endDate
  );

  const handleFetchMetrics = () => {
    if (username.trim()) {
      fetchMetrics();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          User Metrics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
              />
            </div>
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
          <Button 
            onClick={handleFetchMetrics} 
            disabled={!username.trim() || isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Loading Metrics...
              </>
            ) : (
              <>
                <Calendar className="h-4 w-4 mr-2" />
                Fetch User Metrics
              </>
            )}
          </Button>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
            <p className="text-red-600">Failed to load user metrics</p>
          </div>
        )}

        {metrics && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatsCard
                title="Total Sessions"
                value={metrics.total_sessions}
                description="In selected period"
                icon={<Activity className="h-5 w-5" />}
                className="bg-blue-50 border-blue-200"
              />
              <StatsCard
                title="Total Activities"
                value={metrics.total_activities}
                description="Recorded activities"
                icon={<Activity className="h-5 w-5" />}
                className="bg-green-50 border-green-200"
              />
              <StatsCard
                title="Screen Share Time"
                value={`${Math.round(metrics.total_screen_share_time / 60)}h`}
                description="Total duration"
                icon={<Clock className="h-5 w-5" />}
                className="bg-purple-50 border-purple-200"
              />
            </div>

            {Object.keys(metrics.app_usage).length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Application Usage</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {Object.entries(metrics.app_usage)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 10)
                    .map(([app, count], index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium">{app}</span>
                        <span className="text-sm text-gray-600">{count} times</span>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {metrics.daily_summaries.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Daily Summary</h3>
                <div className="space-y-2">
                  {metrics.daily_summaries.map((summary, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{summary.date}</span>
                        <div className="text-sm text-gray-600">
                          {Math.round(summary.total_screen_share_time / 60)}h screen share, {summary.total_activities} activities
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {isEnabled && !metrics && !isLoading && !error && (
          <div className="text-center text-gray-500">
            No metrics data available for the selected criteria.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserMetricsCard;
