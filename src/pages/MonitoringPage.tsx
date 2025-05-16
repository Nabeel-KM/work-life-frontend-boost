
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Check, Clock, User, Settings } from "lucide-react";
import { api, UserData } from "@/lib/api";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import UserCard from "@/components/monitoring/UserCard";
import StatsCard from "@/components/monitoring/StatsCard";
import ScreenshotsModal from "@/components/monitoring/ScreenshotsModal";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatHours } from "@/lib/utils-time";
import { useQuery } from "@tanstack/react-query";

const MonitoringPage = () => {
  const { toast } = useToast();
  const [isScreenshotsModalOpen, setIsScreenshotsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Fetch dashboard data
  const { data: users, isLoading, error, refetch } = useQuery({
    queryKey: ["dashboard"],
    queryFn: api.fetchDashboard,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Handle refresh button click
  const handleRefresh = () => {
    refetch();
    toast({
      title: "Refreshing data",
      description: "Fetching the latest monitoring data",
    });
  };

  // Stats calculations
  const activeUsers = users?.filter(user => user.screen_shared || user.active_app) || [];
  const idleUsers = users?.filter(user => !user.screen_shared && user.total_idle_time > 0) || [];
  const offlineUsers = users?.filter(user => !user.screen_shared && !user.active_app) || [];
  
  const totalWorkingTime = users?.reduce((total, user) => total + (user.total_session_time || 0), 0) || 0;
  
  // Handle screenshot view
  const handleViewScreenshots = (username: string) => {
    setSelectedUser(username);
    setIsScreenshotsModalOpen(true);
  };
  
  if (error) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-full p-8 text-center">
          <h2 className="text-2xl font-bold mb-2">Unable to load monitoring data</h2>
          <p className="text-gray-500 mb-4">There was an error connecting to the server. Please try again later.</p>
          <Button onClick={handleRefresh}>Retry Connection</Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard 
          title="Active Employees"
          value={activeUsers.length.toString()}
          description="Currently working"
          icon={<Check className="h-5 w-5" />}
          trend={users?.length ? Math.round((activeUsers.length / users.length) * 100) : 0}
          className="bg-green-50 dark:bg-green-900/20"
        />
        <StatsCard 
          title="Idle Employees"
          value={idleUsers.length.toString()}
          description="Away from keyboard"
          icon={<Clock className="h-5 w-5" />}
          trend={users?.length ? Math.round((idleUsers.length / users.length) * 100) : 0}
          className="bg-yellow-50 dark:bg-yellow-900/20"
        />
        <StatsCard 
          title="Offline Employees"
          value={offlineUsers.length.toString()}
          description="Not currently working"
          icon={<User className="h-5 w-5" />}
          trend={users?.length ? Math.round((offlineUsers.length / users.length) * 100) : 0}
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
            {isLoading ? "Loading employee data..." : `Monitoring ${users?.length || 0} employees`}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid gap-4 p-4">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-pulse">Loading employee data...</div>
              </div>
            ) : users && users.length > 0 ? (
              users.map((user) => (
                <UserCard
                  key={user.username}
                  user={user}
                  onViewScreenshots={handleViewScreenshots}
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
    </DashboardLayout>
  );
};

export default MonitoringPage;
