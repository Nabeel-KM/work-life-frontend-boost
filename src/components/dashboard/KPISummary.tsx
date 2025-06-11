
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Timer, Monitor, Camera, TrendingUp, TrendingDown } from 'lucide-react';
import { UserData } from '@/lib/api';

interface KPISummaryProps {
  users: UserData[];
}

interface KPICardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  trend?: number;
  trendLabel?: string;
  color: string;
}

const KPICard = ({ title, value, subtitle, icon, trend, trendLabel, color }: KPICardProps) => (
  <Card className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center shadow-lg`}>
            {icon}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-500">{subtitle}</p>
          </div>
        </div>
        {trend !== undefined && (
          <div className="text-right">
            <div className={`flex items-center gap-1 ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              <span className="text-sm font-semibold">{Math.abs(trend)}%</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-500">{trendLabel}</p>
          </div>
        )}
      </div>
    </CardContent>
  </Card>
);

const KPISummary = ({ users }: KPISummaryProps) => {
  // Calculate aggregate metrics
  const totalActiveTime = users.reduce((sum, user) => sum + (user.total_active_time || 0), 0);
  const totalIdleTime = users.reduce((sum, user) => sum + (user.total_idle_time || 0), 0);
  const totalAppsUsed = new Set(users.flatMap(user => user.active_apps || [])).size;
  const estimatedScreenshots = users.reduce((sum, user) => sum + Math.floor((user.total_active_time || 0) / 10), 0);

  // Format time display
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const kpiData = [
    {
      title: "Active Time",
      value: formatTime(totalActiveTime),
      subtitle: "Total productive time",
      icon: <Clock className="h-6 w-6 text-white" />,
      trend: 8,
      trendLabel: "vs yesterday",
      color: "bg-gradient-to-r from-green-500 to-emerald-600"
    },
    {
      title: "Idle Time", 
      value: formatTime(totalIdleTime),
      subtitle: "Away from work",
      icon: <Timer className="h-6 w-6 text-white" />,
      trend: -12,
      trendLabel: "vs yesterday",
      color: "bg-gradient-to-r from-yellow-500 to-amber-600"
    },
    {
      title: "Apps Used",
      value: totalAppsUsed.toString(),
      subtitle: "Unique applications",
      icon: <Monitor className="h-6 w-6 text-white" />,
      trend: 5,
      trendLabel: "vs yesterday",
      color: "bg-gradient-to-r from-blue-500 to-indigo-600"
    },
    {
      title: "Screenshots",
      value: estimatedScreenshots.toString(),
      subtitle: "Captured today",
      icon: <Camera className="h-6 w-6 text-white" />,
      trend: 15,
      trendLabel: "vs yesterday",
      color: "bg-gradient-to-r from-purple-500 to-violet-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {kpiData.map((kpi, index) => (
        <div key={kpi.title} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
          <KPICard {...kpi} />
        </div>
      ))}
    </div>
  );
};

export default KPISummary;
