
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSystemMetrics } from '@/hooks/use-metrics';
import { Button } from '@/components/ui/button';
import { RefreshCw, Users, Activity, BarChart3, Clock } from 'lucide-react';
import StatsCard from '@/components/monitoring/StatsCard';

const SystemMetricsCard = () => {
  const { data: metrics, isLoading, error, refetch } = useSystemMetrics();

  if (error) {
    return (
      <Card className="bg-red-50 border-red-200">
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-red-600">Failed to load system metrics</p>
            <Button onClick={refetch} className="mt-2" variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            System Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!metrics) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          System Metrics
        </CardTitle>
        <Button onClick={refetch} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatsCard
            title="Total Users"
            value={metrics.total_users}
            description="Registered users"
            icon={<Users className="h-5 w-5" />}
            className="bg-blue-50 border-blue-200"
          />
          <StatsCard
            title="Active This Week"
            value={metrics.active_users_this_week}
            description="Users with activity"
            icon={<Activity className="h-5 w-5" />}
            trend={metrics.total_users > 0 ? Math.round((metrics.active_users_this_week / metrics.total_users) * 100) : 0}
            className="bg-green-50 border-green-200"
          />
          <StatsCard
            title="Total Sessions"
            value={metrics.total_sessions_this_week}
            description="This week"
            icon={<Activity className="h-5 w-5" />}
            className="bg-purple-50 border-purple-200"
          />
          <StatsCard
            title="Avg Screen Share"
            value={`${Math.round(metrics.avg_screen_share_time / 60)}h`}
            description="Per session"
            icon={<Clock className="h-5 w-5" />}
            className="bg-orange-50 border-orange-200"
          />
        </div>

        {metrics.top_applications.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-3">Top Applications This Week</h3>
            <div className="space-y-2">
              {metrics.top_applications.slice(0, 5).map((app, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">{app.app}</span>
                  <span className="text-sm text-gray-600">{app.count} activities</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SystemMetricsCard;
