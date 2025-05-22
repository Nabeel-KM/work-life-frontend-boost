
import React, { useState, Suspense, memo, useCallback, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useApi } from "@/hooks/use-api";
import { Check, Clock, User, Settings, AlertTriangle, Wifi, WifiOff } from "lucide-react";
import { api, UserData } from "@/lib/api";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import UserCard from "@/components/monitoring/UserCard";
import StatsCard from "@/components/monitoring/StatsCard";
import ScreenshotsModal from "@/components/monitoring/ScreenshotsModal";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatHours } from "@/lib/utils-time";
import UserHistoryModal from "@/components/monitoring/UserHistoryModal";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { DashboardSkeleton } from "@/components/ui/loading-skeleton";
import { toast } from "sonner";

const MonitoringPage = () => {
  const { toast: shadowToast } = useToast();
  const [isScreenshotsModalOpen, setIsScreenshotsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [showHistory, setShowHistory] = useState(false);
  const [historyUser, setHistoryUser] = useState<string | null>(null);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [dashboardData, setDashboardData] = useState<UserData[]>([]);

  // Use a stable fetch function to prevent re-renders
  const fetchDashboard = useCallback(() => api.fetchDashboard(), []);

  const { data: users, isLoading, error, refetch } = useApi(fetchDashboard, {
    retryCount: 1, // Reduce retry count to prevent flickering
    retryDelay: 2000,
    onSuccess: (data) => {
      console.log("Dashboard data loaded successfully:", data);
      setDashboardData(data || []);
    },
    onError: (err) => {
      console.error("Dashboard data error:", err);
      if (err.message === "Network Error") {
        setIsOfflineMode(true);
        toast.warning("Network connection issue detected", {
          description: "Using offline mode with mock data",
          icon: <WifiOff className="h-4 w-4" />
        });
      }
    },
    showErrorToast: false // Handle errors ourselves to prevent multiple toasts
  });

  // Ensure we have stable data to prevent re-renders
  useEffect(() => {
    if (users && Array.isArray(users)) {
      setDashboardData(users);
    }
  }, [users]);

  const handleRefresh = useCallback(() => {
    refetch();
    toast.info("Refreshing data", {
      description: "Fetching the latest monitoring data",
    });
  }, [refetch]);

  const handleToggleOfflineMode = useCallback(() => {
    setIsOfflineMode(prev => !prev);
    if (!isOfflineMode) {
      toast.info("Switched to offline mode", {
        description: "Using mock data for development",
      });
      // Load mock data directly
      api.getMockDashboardData().then(data => {
        setDashboardData(data);
      });
    } else {
      toast.info("Trying online mode", {
        description: "Attempting to connect to API",
      });
      refetch();
    }
  }, [isOfflineMode, refetch]);

  // Ensure users is always an array and stable
  const safeUsers: UserData[] = dashboardData || [];
  
  // Stats calculations with safe array handling
  const activeUsers = safeUsers.filter(user => user?.screen_shared || user?.active_app);
  const idleUsers = safeUsers.filter(user => !user?.screen_shared && user?.total_idle_time > 0);
  const offlineUsers = safeUsers.filter(user => !user?.screen_shared && !user?.active_app);
  
  const totalWorkingTime = safeUsers.reduce((total, user) => total + (user?.total_session_time || 0), 0);
  
  // Handle screenshot view
  const handleViewScreenshots = useCallback((username: string) => {
    setSelectedUser(username);
    setIsScreenshotsModalOpen(true);
  }, []);

  // Handle history view
  const handleViewHistory = useCallback((username: string) => {
    setHistoryUser(username);
    setShowHistory(true);
  }, []);
  
  if (error && !isOfflineMode) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-full p-8 text-center">
          <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
          <h2 className="text-2xl font-bold mb-2">Unable to load monitoring data</h2>
          <p className="text-muted-foreground mb-4">{error.message}</p>
          <div className="flex gap-4">
            <Button onClick={handleRefresh} className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Retry Connection
            </Button>
            <Button 
              onClick={handleToggleOfflineMode} 
              variant="outline"
              className="flex items-center gap-2"
            >
              <WifiOff className="h-4 w-4" />
              Use Offline Mode
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <ErrorBoundary>
        {/* Remove Suspense to prevent flickering */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Work Monitoring</h1>
            <p className="text-muted-foreground flex items-center gap-2">
              Track and manage your remote workforce in real-time.
              {isOfflineMode && (
                <span className="inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                  <WifiOff className="h-3 w-3 mr-1" />
                  Offline Mode
                </span>
              )}
            </p>
          </div>
          <div className="flex gap-2">
            {isOfflineMode ? (
              <Button 
                onClick={handleToggleOfflineMode} 
                variant="outline"
                className="flex items-center gap-2"
              >
                <Wifi className="h-4 w-4" />
                Try Online Mode
              </Button>
            ) : (
              <Button 
                onClick={handleToggleOfflineMode} 
                variant="outline"
                className="flex items-center gap-2"
              >
                <WifiOff className="h-4 w-4" />
                Use Offline Mode
              </Button>
            )}
            <Button onClick={handleRefresh} className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Refresh Data
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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
          <StatsCard 
            title="Total Working Hours"
            value={formatHours(totalWorkingTime || 0)}
            description="Today's progress"
            icon={<Settings className="h-5 w-5" />}
            className="bg-blue-50 dark:bg-blue-900/20"
          />
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Team Activity</CardTitle>
            <CardDescription>
              {isLoading 
                ? "Loading employee data..." 
                : isOfflineMode 
                  ? `Viewing ${safeUsers.length} employees (Offline Mode)` 
                  : `Monitoring ${safeUsers.length} employees`}
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
      </ErrorBoundary>
    </DashboardLayout>
  );
};

export default MonitoringPage;
