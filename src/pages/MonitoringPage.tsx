import React, { useState, Suspense, memo, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useApi } from "@/hooks/use-api";
import { Check, Clock, User, AlertTriangle, RefreshCw, Activity } from "lucide-react";
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

  // Memoize the fetch function to prevent it from being recreated on every render
  const fetchDashboard = useCallback(() => {
    return api.fetchDashboard();
  }, []); // Empty dependency array since api.fetchDashboard is stable

  const { data: users, isLoading, error, refetch } = useApi(fetchDashboard);

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
        <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-red-50 via-white to-red-50 dark:from-red-950/20 dark:via-gray-900 dark:to-red-950/20">
          <div className="max-w-md mx-auto animate-fade-in">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/50 dark:to-red-800/50 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-12 w-12 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-red-600 to-red-800 dark:from-red-400 dark:to-red-600 bg-clip-text text-transparent">
              Connection Error
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
              Unable to load monitoring data. Please check your connection and try again.
            </p>
            <Button 
              onClick={handleRefresh} 
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry Connection
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <ErrorBoundary>
        <Suspense fallback={<DashboardSkeleton />}>
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950/20">
            {/* Header Section with Enhanced Styling */}
            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-10">
              <div className="max-w-7xl mx-auto px-6 py-6">
                <div className="flex justify-between items-center">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                        <Activity className="h-5 w-5 text-white" />
                      </div>
                      <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent">
                        Work Monitoring
                      </h1>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                      Track and manage your remote workforce in real-time with advanced insights.
                    </p>
                  </div>
                  <Button 
                    onClick={handleRefresh} 
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 flex items-center gap-2 px-6 py-3"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Refresh Data
                  </Button>
                </div>
              </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
              {/* Enhanced Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="group hover:scale-105 transition-all duration-300">
                  <StatsCard 
                    title="Active Employees"
                    value={activeUsers.length.toString()}
                    description="Currently working and productive"
                    icon={<Check className="h-5 w-5" />}
                    trend={safeUsers.length ? Math.round((activeUsers.length / safeUsers.length) * 100) : 0}
                    className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-green-200/50 dark:border-green-800/50 shadow-lg hover:shadow-xl transition-all duration-300"
                  />
                </div>
                <div className="group hover:scale-105 transition-all duration-300">
                  <StatsCard 
                    title="Idle Employees"
                    value={idleUsers.length.toString()}
                    description="Temporarily away from work"
                    icon={<Clock className="h-5 w-5" />}
                    trend={safeUsers.length ? Math.round((idleUsers.length / safeUsers.length) * 100) : 0}
                    className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950/30 dark:to-amber-950/30 border-yellow-200/50 dark:border-yellow-800/50 shadow-lg hover:shadow-xl transition-all duration-300"
                  />
                </div>
                <div className="group hover:scale-105 transition-all duration-300">
                  <StatsCard 
                    title="Offline Employees"
                    value={offlineUsers.length.toString()}
                    description="Not currently active"
                    icon={<User className="h-5 w-5" />}
                    trend={safeUsers.length ? Math.round((offlineUsers.length / safeUsers.length) * 100) : 0}
                    className="bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-950/30 dark:to-slate-950/30 border-gray-200/50 dark:border-gray-800/50 shadow-lg hover:shadow-xl transition-all duration-300"
                  />
                </div>
              </div>

              {/* Enhanced Team Activity Card */}
              <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300">
                <CardHeader className="pb-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 rounded-t-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 dark:from-white dark:to-blue-200 bg-clip-text text-transparent">
                        Team Activity Dashboard
                      </CardTitle>
                      <CardDescription className="text-gray-600 dark:text-gray-400 mt-2">
                        {isLoading ? (
                          <span className="animate-pulse">Loading employee data...</span>
                        ) : (
                          `Real-time monitoring of ${safeUsers.length} team members`
                        )}
                      </CardDescription>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Activity className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="p-6">
                    {isLoading ? (
                      <div className="flex justify-center items-center py-16">
                        <div className="text-center space-y-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full animate-pulse mx-auto"></div>
                          <p className="text-gray-600 dark:text-gray-400 animate-pulse">Loading team data...</p>
                        </div>
                      </div>
                    ) : safeUsers.length > 0 ? (
                      <div className="space-y-6">
                        {safeUsers.map((user, index) => (
                          <div 
                            key={user.username} 
                            className="animate-fade-in hover:scale-[1.02] transition-all duration-300"
                            style={{ animationDelay: `${index * 100}ms` }}
                          >
                            <UserCard
                              user={user}
                              onViewScreenshots={handleViewScreenshots}
                              onViewHistory={handleViewHistory}
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-16 space-y-4">
                        <div className="w-20 h-20 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center mx-auto">
                          <User className="h-10 w-10 text-gray-500 dark:text-gray-400" />
                        </div>
                        <div>
                          <p className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">No Team Data Available</p>
                          <p className="text-gray-500 dark:text-gray-500">Start monitoring by connecting your team members</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Modals */}
            <ScreenshotsModal
              isOpen={isScreenshotsModalOpen}
              onClose={() => setIsScreenshotsModalOpen(false)}
              username={selectedUser}
              date={selectedDate}
            />

            <UserHistoryModal
              isOpen={showHistory}
              onClose={() => setShowHistory(false)}
              username={historyUser || ""}
            />
          </div>
        </Suspense>
      </ErrorBoundary>
    </DashboardLayout>
  );
};

export default memo(MonitoringPage);
