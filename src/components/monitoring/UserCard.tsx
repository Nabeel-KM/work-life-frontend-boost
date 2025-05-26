
import React, { useState, memo, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { UserData } from "@/lib/api";
import { formatSecondsToTime, formatTimeOnly, formatHours, formatMinutesToTime } from "@/lib/utils-time";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { History, Image, User, Activity, Clock, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";

interface UserCardProps {
  user: UserData;
  onViewScreenshots: (username: string) => void;
  onViewHistory: (username: string) => void;
}

// Memoized app usage component with enhanced styling
const AppUsageItem = memo(({ app, totalActiveTime }: { 
  app: { app_name: string; total_time: number }; 
  totalActiveTime: number 
}) => (
  <div key={app.app_name} className="flex items-center justify-between group hover:bg-gray-50 dark:hover:bg-gray-800/50 p-2 rounded-lg transition-all duration-200">
    <span className="text-sm truncate max-w-[70%] font-medium text-gray-700 dark:text-gray-300">{app.app_name}</span>
    <div className="flex items-center gap-3">
      <div className="w-16 h-2 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500 ease-out"
          style={{ 
            width: `${Math.min(100, (app.total_time / (totalActiveTime || 1)) * 100)}%` 
          }}
        ></div>
      </div>
      <span className="text-xs text-gray-500 dark:text-gray-400 font-medium min-w-[3rem] text-right">
        {formatMinutesToTime(app.total_time)}
      </span>
    </div>
  </div>
));

AppUsageItem.displayName = "AppUsageItem";

const UserCard = memo(({ user, onViewScreenshots, onViewHistory }: UserCardProps) => {
  // Enhanced status indicator with gradients
  const statusInfo = useMemo(() => {
    if (user.screen_shared) return {
      color: "bg-gradient-to-r from-green-400 to-emerald-500",
      text: "Active",
      textColor: "text-green-700 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-950/20"
    };
    if (user.active_app) return {
      color: "bg-gradient-to-r from-yellow-400 to-amber-500",
      text: "Working",
      textColor: "text-yellow-700 dark:text-yellow-400",
      bgColor: "bg-yellow-50 dark:bg-yellow-950/20"
    };
    return {
      color: "bg-gradient-to-r from-gray-400 to-gray-500",
      text: "Offline",
      textColor: "text-gray-600 dark:text-gray-400",
      bgColor: "bg-gray-50 dark:bg-gray-950/20"
    };
  }, [user.screen_shared, user.active_app]);

  // Ensure app_usage is always an array before sorting
  const appUsage = Array.isArray(user.app_usage) ? user.app_usage : [];
  
  // Top apps (limit to 3)
  const topApps = useMemo(() => 
    appUsage
      .sort((a, b) => b.total_time - a.total_time)
      .slice(0, 3),
    [appUsage]
  );

  const handleHistoryClick = useCallback(() => {
    onViewHistory(user.username);
  }, [onViewHistory, user.username]);

  const handleScreenshotsClick = useCallback(() => {
    onViewScreenshots(user.username);
  }, [onViewScreenshots, user.username]);

  return (
    <Card className={cn(
      "overflow-hidden bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 group border-gray-200/50 dark:border-gray-700/50",
      user.screen_shared && "border-green-300/60 dark:border-green-800/60 shadow-green-100/50 dark:shadow-green-900/20"
    )}>
      <CardContent className="p-0">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Enhanced User info section */}
          <div className="lg:col-span-4 p-6 bg-gradient-to-br from-gray-50/50 to-white dark:from-gray-900/50 dark:to-gray-800/50 border-r border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-start gap-4">
              <div className="relative">
                <div className={`h-4 w-4 rounded-full ${statusInfo.color} shadow-lg`}></div>
                <div className={`absolute inset-0 h-4 w-4 rounded-full ${statusInfo.color} animate-ping opacity-30`}></div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-1 truncate">
                  <Link 
                    to={`/user/${user.username}`} 
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 hover:underline"
                  >
                    {user.display_name || user.username}
                  </Link>
                </h3>
                
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {user.channel || "No channel"}
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className={cn("text-sm font-medium", statusInfo.textColor)}>
                    {statusInfo.text}
                  </span>
                </div>
                
                {user.active_app && (
                  <div className="mb-4">
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "text-xs font-medium border-blue-200 dark:border-blue-800",
                        statusInfo.bgColor
                      )}
                    >
                      <Monitor className="h-3 w-3 mr-1" />
                      {user.active_app}
                    </Badge>
                  </div>
                )}
                
                <div className="space-y-2 text-xs">
                  {user.duty_start_time && (
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Clock className="h-3 w-3" />
                      <span>Started: {formatTimeOnly(user.duty_start_time)}</span>
                    </div>
                  )}
                  {user.duty_end_time && (
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Clock className="h-3 w-3" />
                      <span>Ended: {formatTimeOnly(user.duty_end_time)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex flex-wrap gap-2">
              <Button 
                size="sm" 
                variant="outline"
                className="flex items-center gap-1 hover:bg-blue-50 dark:hover:bg-blue-950/20 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-200" 
                onClick={handleHistoryClick}
              >
                <History className="h-3.5 w-3.5" />
                History
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                className="flex items-center gap-1 hover:bg-purple-50 dark:hover:bg-purple-950/20 hover:border-purple-300 dark:hover:border-purple-700 transition-all duration-200"
                onClick={handleScreenshotsClick}
              >
                <Image className="h-3.5 w-3.5" />
                Screenshots
              </Button>
              <Link to={`/user/${user.username}`}>
                <Button 
                  size="sm" 
                  className="flex items-center gap-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all duration-200"
                >
                  <User className="h-3.5 w-3.5" />
                  Details
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Enhanced Activity metrics section */}
          <div className="lg:col-span-8 p-6">
            {/* Metrics Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30 p-4 rounded-xl border border-blue-200/50 dark:border-blue-800/50">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <h4 className="text-sm font-medium text-blue-900 dark:text-blue-200">Active Time</h4>
                </div>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                  {formatMinutesToTime(user.total_active_time || 0)}
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/30 p-4 rounded-xl border border-purple-200/50 dark:border-purple-800/50">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  <h4 className="text-sm font-medium text-purple-900 dark:text-purple-200">Session</h4>
                </div>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                  {user.total_session_time?.toFixed(1)}h
                </p>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/30 dark:to-amber-900/30 p-4 rounded-xl border border-amber-200/50 dark:border-amber-800/50">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  <h4 className="text-sm font-medium text-amber-900 dark:text-amber-200">Idle Time</h4>
                </div>
                <p className="text-2xl font-bold text-amber-900 dark:text-amber-100">
                  {formatMinutesToTime(user.total_idle_time || 0)}
                </p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/30 p-4 rounded-xl border border-green-200/50 dark:border-green-800/50">
                <div className="flex items-center gap-2 mb-2">
                  <Monitor className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <h4 className="text-sm font-medium text-green-900 dark:text-green-200">Screen Share</h4>
                </div>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                  {formatSecondsToTime(user.screen_share_time || 0)}
                </p>
              </div>
            </div>
            
            {/* Enhanced Top apps section */}
            <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900/50 dark:to-gray-800/50 p-4 rounded-xl border border-gray-200/50 dark:border-gray-700/50">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Top Applications
              </h4>
              {topApps && topApps.length > 0 ? (
                <div className="space-y-2">
                  {topApps.map((app) => (
                    <AppUsageItem 
                      key={app.app_name} 
                      app={app} 
                      totalActiveTime={user.total_active_time || 1} 
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <Activity className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">No application usage data</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

UserCard.displayName = "UserCard";

export default UserCard;
