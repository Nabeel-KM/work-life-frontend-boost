
import React, { useState, memo, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { UserData } from "@/lib/api";
import { formatSecondsToTime, formatTimeOnly, formatHours, formatMinutesToTime } from "@/lib/utils-time";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { History, Image, User } from "lucide-react";
import UserHistoryModal from "./UserHistoryModal";
import { cn } from "@/lib/utils";

interface UserCardProps {
  user: UserData;
  onViewScreenshots: (username: string) => void;
}

// Memoized app usage component
const AppUsageItem = memo(({ app, totalActiveTime }: { 
  app: { app_name: string; total_time: number }; 
  totalActiveTime: number 
}) => (
  <div key={app.app_name} className="flex items-center justify-between">
    <span className="text-sm truncate max-w-[70%]">{app.app_name}</span>
    <div className="flex items-center gap-2">
      <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div 
          className="h-full bg-blue-500 rounded-full"
          style={{ 
            width: `${Math.min(100, (app.total_time / (totalActiveTime || 1)) * 100)}%` 
          }}
        ></div>
      </div>
      <span className="text-xs text-muted-foreground">{formatMinutesToTime(app.total_time)}</span>
    </div>
  </div>
));

AppUsageItem.displayName = "AppUsageItem";

const UserCard = memo(({ user, onViewScreenshots }: UserCardProps) => {
  const [showHistory, setShowHistory] = useState(false);

  // Status indicator color
  const statusColor = useMemo(() => {
    if (user.screen_shared) return "bg-green-500";
    if (user.active_app) return "bg-yellow-500";
    return "bg-gray-500";
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
    setShowHistory(true);
  }, []);

  const handleHistoryClose = useCallback(() => {
    setShowHistory(false);
  }, []);

  const handleScreenshotsClick = useCallback(() => {
    onViewScreenshots(user.username);
  }, [onViewScreenshots, user.username]);

  return (
    <Card className={cn("overflow-hidden", user.screen_shared && "border-green-200 dark:border-green-800")}>
      <CardContent className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-5 lg:grid-cols-6">
          {/* User info section */}
          <div className="p-4 lg:p-6 md:col-span-2 lg:border-r border-gray-100 dark:border-gray-800">
            <div className="flex items-start gap-3">
              <div className={`h-3 w-3 rounded-full mt-1.5 ${statusColor}`}></div>
              <div>
                <h3 className="font-medium text-lg">
                  <Link to={`/user/${user.username}`} className="hover:underline text-primary">
                    {user.display_name || user.username}
                  </Link>
                </h3>
                
                <p className="text-muted-foreground text-sm">
                  {user.channel || "No active channel"} • 
                  {user.screen_shared 
                    ? <span className="text-green-600 dark:text-green-400"> Streaming</span> 
                    : user.active_app 
                      ? <span className="text-yellow-600 dark:text-yellow-400"> Active</span>
                      : <span className="text-gray-500"> Offline</span>
                  }
                </p>
                
                {user.active_app && (
                  <div className="mt-2">
                    <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800">
                      {user.active_app}
                    </Badge>
                  </div>
                )}
                
                <div className="mt-4 space-y-1">
                  {user.duty_start_time && (
                    <p className="text-xs text-muted-foreground">Started: {formatTimeOnly(user.duty_start_time)}</p>
                  )}
                  {user.duty_end_time && (
                    <p className="text-xs text-muted-foreground">Ended: {formatTimeOnly(user.duty_end_time)}</p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex flex-wrap gap-2">
              <Button 
                size="sm" 
                variant="outline"
                className="flex items-center gap-1" 
                onClick={handleHistoryClick}
              >
                <History className="h-3.5 w-3.5" />
                History
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                className="flex items-center gap-1"
                onClick={handleScreenshotsClick}
              >
                <Image className="h-3.5 w-3.5" />
                Screenshots
              </Button>
              <Link to={`/user/${user.username}`}>
                <Button 
                  size="sm" 
                  variant="default"
                  className="flex items-center gap-1"
                >
                  <User className="h-3.5 w-3.5" />
                  Details
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Activity metrics section */}
          <div className="p-4 lg:p-6 md:col-span-3 lg:col-span-4 bg-gray-50/50 dark:bg-gray-900/50">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Active Time</h4>
                <p className="text-xl font-bold mt-1">{formatMinutesToTime(user.total_active_time || 0)}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Session Time</h4>
                <p className="text-xl font-bold mt-1">{user.total_session_time?.toFixed(1)}h</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Idle Time</h4>
                <p className="text-xl font-bold mt-1">{formatMinutesToTime(user.total_idle_time || 0)}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Screen Share</h4>
                <p className="text-xl font-bold mt-1">{formatSecondsToTime(user.screen_share_time || 0)}</p>
              </div>
            </div>
            
            {/* Top apps section */}
            <div className="mt-6">
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Top Applications</h4>
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
                <p className="text-sm text-muted-foreground">No application usage data</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
      
      {/* History Modal */}
      {showHistory && (
        <UserHistoryModal 
          isOpen={showHistory} 
          onClose={handleHistoryClose} 
          username={user.username}
        />
      )}
    </Card>
  );
});

UserCard.displayName = "UserCard";

export default UserCard;
