
import React, { useState, Suspense, memo, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useApi } from "@/hooks/use-api";
import { Check, Clock, User, AlertTriangle } from "lucide-react";
import { api, UserData } from "@/lib/api";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import UserCard from "@/components/monitoring/UserCard";
import StatsCard from "@/components/monitoring/StatsCard";
import ScreenshotsModal from "@/components/monitoring/ScreenshotsModal";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import UserHistoryModal from "@/components/monitoring/UserHistoryModal";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { DashboardSkeleton } from "@/components/ui/loading-skeleton";

const MonitoringPage = () => {
  const { toast } = useToast();
  const [isScreenshotsModalOpen, setIsScreenshotsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [showHistory, setShowHistory] = useState(false);
  const [historyUser, setHistoryUser] = useState<string | null>(null);

  const { data: users, isLoading, error, refetch } = useApi(api.fetchDashboard, {
    retryCount: 3,
    retryDelay: 2000
  });

  const handleRefresh = useCallback(() => {
    refetch();
    toast({
      title: "Refreshing data",
      description: "Fetching the latest monitoring data",
    });
  }, [refetch, toast]);

  // Handler functions
  const handleViewScreenshots = useCallback((username: string) => {
    setSelectedUser(username);
    setIsScreenshotsModalOpen(true);
  }, []);

  const handleViewHistory = useCallback((username: string) => {
    setHistoryUser(username);
    setShowHistory(true);
  }, []);

  // Ensure users is always an array
  const safeUsers: UserData[] = Array.isArray(users) ? users : [];
  
  // Stats calculations with safe array handling
  const activeUsers = safeUsers.filter(user => user?.screen_shared || user?.active_app);
  const idleUsers = safeUsers.filter(user => !user?.screen_shared && user?.total_idle_time > 0);
  const offlineUsers = safeUsers.filter(user => !user?.screen_shared && !user?.active_app);
  
  if (error) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-full p-8 text-center">
          <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
          <h2 className="text-2xl font-bold mb-2">Unable to load monitoring data</h2>
          <p className="text-muted-foreground mb-4">{error.message}</p>
          <Button onClick={handleRefresh}>Retry Connection</Button>
        </div>
      </DashboardLayout>
    );
  }

  // Debug loading state
  console.log("Dashboard loading state:", isLoading);
  console.log("Dashboard data:", users);

  return (
    <DashboardLayout>
      <ErrorBoundary>
        <Suspense fallback={<DashboardSkeleton />}>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Work Monitoring</h1>
              <p className="text-muted-foreground">Track and manage your remote workforce in real-time.</p>
            </div>
            <Button onClick={handleRefresh} className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Refresh Data
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <StatsCard 
              title="Active Employees"
              value={activeUsers.length.toString()}
              description="Currently working"
              icon={<Check className="h-5 w-5" />}
              trend={safeUsers.length ? Math.round((activeUsers.length / safeUsers.length) * 100) : 0}
              className="bg-green-50 dark:bg-green-900/20"
            />
            <StatsCard 
              title="Idle Employees"
              value={idleUsers.length.toString()}
              description="Away from keyboard"
              icon={<Clock className="h-5 w-5" />}
              trend={safeUsers.length ? Math.round((idleUsers.length / safeUsers.length) * 100) : 0}
              className="bg-yellow-50 dark:bg-yellow-900/20"
            />
            <StatsCard 
              title="Offline Employees"
              value={offlineUsers.length.toString()}
              description="Not currently working"
              icon={<User className="h-5 w-5" />}
              trend={safeUsers.length ? Math.round((offlineUsers.length / safeUsers.length) * 100) : 0}
              className="bg-gray-50 dark:bg-gray-900/20"
            />
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Team Activity</CardTitle>
              <CardDescription>
                {isLoading ? "Loading employee data..." : `Monitoring ${safeUsers.length} employees`}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid gap-4 p-4">
                {isLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-pulse">Loading employee data...</div>
                  </div>
                ) : safeUsers.length > 0 ? (
                  safeUsers.map((user) => (
                    <UserCard
                      key={user.username}
                      user={user}
                      onViewScreenshots={handleViewScreenshots}
                      onViewHistory={handleViewHistory}
                    />
                  ))
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No employees data available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Screenshots Modal */}
          <ScreenshotsModal
            isOpen={isScreenshotsModalOpen}
            onClose={() => setIsScreenshotsModalOpen(false)}
            username={selectedUser}
            date={selectedDate}
          />

          {/* History Modal */}
          <UserHistoryModal
            isOpen={showHistory}
            onClose={() => setShowHistory(false)}
            username={historyUser || ""}
          />
        </Suspense>
      </ErrorBoundary>
    </DashboardLayout>
  );
};

export default memo(MonitoringPage);
