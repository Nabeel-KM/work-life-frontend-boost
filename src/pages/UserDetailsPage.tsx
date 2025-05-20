import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format, subDays } from "date-fns";
import { api, UserHistory, Screenshot } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Calendar, ArrowLeft } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatHours, formatTimeOnly, formatDate, formatMinutesToTime } from "@/lib/utils-time";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Separator } from "@/components/ui/separator";

const UserDetailsPage = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [screenshots, setScreenshots] = useState<Screenshot[]>([]);
  const [userHistory, setUserHistory] = useState<UserHistory | null>(null);
  const [isLoadingScreenshots, setIsLoadingScreenshots] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [tabValue, setTabValue] = useState("overview");

  // Generate an array of the last 7 dates
  const pastDates = Array.from({ length: 7 }).map((_, i) => {
    const date = subDays(new Date(), i);
    return {
      value: format(date, "yyyy-MM-dd"),
      label: format(date, "MMM dd")
    };
  });

  // Fetch user history
  useEffect(() => {
    if (!username) return;
    
    setIsLoadingHistory(true);
    api.fetchHistory(username, 7)
      .then(data => {
        if (!data) {
          throw new Error('No history data returned');
        }
        setUserHistory(data);
      })
      .catch(error => {
        console.error("Failed to fetch user history:", error);
        toast({
          title: "Error loading history",
          description: "Could not load the user's activity history",
          variant: "destructive",
        });
      })
      .finally(() => {
        setIsLoadingHistory(false);
      });
  }, [username, toast]);

  // Fetch screenshots for selected date
  useEffect(() => {
    if (!username || !selectedDate || tabValue !== "screenshots") return;
    
    setIsLoadingScreenshots(true);
    api.fetchScreenshots(username, selectedDate)
      .then(data => {
        // Ensure screenshots is an array
        setScreenshots(Array.isArray(data) ? data : []);
      })
      .catch(error => {
        console.error("Failed to fetch screenshots:", error);
        toast({
          title: "Error loading screenshots",
          description: `Could not load screenshots for ${selectedDate}`,
          variant: "destructive",
        });
      })
      .finally(() => {
        setIsLoadingScreenshots(false);
      });
  }, [username, selectedDate, tabValue, toast]);

  // Make sure userHistory.days is an array
  const historyDays = userHistory?.days && Array.isArray(userHistory.days) ? userHistory.days : [];
  
  // Find day data for the selected date
  const selectedDayData = historyDays.find(day => day.date === selectedDate);
  const displayName = userHistory?.display_name || username;

  // Ensure app_usage is always an array when accessed
  const dayAppUsage = selectedDayData?.app_usage && Array.isArray(selectedDayData.app_usage) 
    ? selectedDayData.app_usage 
    : [];

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/monitoring')}
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{displayName}</h1>
            <p className="text-muted-foreground">Activity and monitoring details</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Select Date</CardTitle>
            <CardDescription>View data for a specific date</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {pastDates.map((date) => (
                <Button
                  key={date.value}
                  variant={selectedDate === date.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedDate(date.value)}
                  className="flex items-center gap-2"
                >
                  <Calendar className="h-4 w-4" />
                  {date.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {selectedDayData && (
          <Card className="flex-1">
            <CardHeader>
              <CardTitle>Daily Summary</CardTitle>
              <CardDescription>{selectedDate}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Time</p>
                  <p className="text-2xl font-bold">{formatMinutesToTime(selectedDayData.total_active_time * 60)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Session Time</p>
                  <p className="text-2xl font-bold">{selectedDayData.total_session_time.toFixed(1)}h</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">First Activity</p>
                  <p className="text-lg">{formatTimeOnly(selectedDayData.first_activity)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Last Activity</p>
                  <p className="text-lg">{formatTimeOnly(selectedDayData.last_activity)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Tabs value={tabValue} onValueChange={setTabValue} className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Activity Overview</TabsTrigger>
          <TabsTrigger value="screenshots">Screenshots</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Activity History</CardTitle>
              <CardDescription>Past 7 days of user activity</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingHistory ? (
                <div className="flex justify-center py-12">
                  <div className="animate-pulse">Loading history data...</div>
                </div>
              ) : historyDays.length > 0 ? (
                <div className="grid gap-6">
                  {historyDays.map((day, index) => (
                    <div key={index} className="flex flex-col">
                      <div className="font-medium text-lg mb-2">{day.date}</div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-secondary/20 p-4 rounded-md">
                          <div className="text-sm text-muted-foreground">Active Time</div>
                          <div className="text-2xl font-bold mt-1">{formatMinutesToTime(day.total_active_time * 60)}</div>
                        </div>
                        <div className="bg-secondary/20 p-4 rounded-md">
                          <div className="text-sm text-muted-foreground">Session Time</div>
                          <div className="text-2xl font-bold mt-1">{day.total_session_time.toFixed(1)}h</div>
                        </div>
                        <div className="bg-secondary/20 p-4 rounded-md">
                          <div className="text-sm text-muted-foreground">Most Used App</div>
                          <div className="text-xl font-bold mt-1">{day.most_used_app || "N/A"}</div>
                          {day.most_used_app_time > 0 && (
                            <div className="text-sm text-muted-foreground">
                              {formatHours(day.most_used_app_time)}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="mt-4">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            setSelectedDate(day.date);
                            setTabValue("screenshots");
                          }}
                        >
                          View Screenshots
                        </Button>
                      </div>
                      {index < historyDays.length - 1 && <Separator className="my-6" />}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No history data available for this user</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="screenshots" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Screenshots for {selectedDate}</CardTitle>
              <CardDescription>
                Screenshots captured throughout the day
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingScreenshots ? (
                <div className="flex justify-center py-12">
                  <div className="animate-pulse">Loading screenshots...</div>
                </div>
              ) : screenshots.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {screenshots.map((screenshot, index) => (
                    <div key={index} className="border rounded-md overflow-hidden bg-background">
                      <a 
                        href={screenshot.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <div className="relative h-40">
                          <AspectRatio ratio={16/9}>
                            <img 
                              src={screenshot.url} 
                              alt={`Screenshot ${index + 1}`}
                              className="w-full h-full object-cover transition-transform hover:scale-105"
                              loading="lazy"
                            />
                          </AspectRatio>
                        </div>
                      </a>
                      <div className="p-2 text-center bg-muted/50">
                        <p className="text-xs text-muted-foreground">
                          {formatTimeOnly(screenshot.last_modified)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No screenshots available for this date</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="applications" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Application Usage for {selectedDate}</CardTitle>
              <CardDescription>
                Applications used throughout the day
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!selectedDayData ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No application data available for this date</p>
                </div>
              ) : dayAppUsage.length > 0 ? (
                <div className="space-y-4">
                  {dayAppUsage
                    .sort((a, b) => b.total_time - a.total_time)
                    .map((app, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="font-medium">{app.app_name}</div>
                        <div className="flex items-center gap-4">
                          <div className="w-48 h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary rounded-full"
                              style={{ 
                                width: `${Math.min(100, (app.total_time / (selectedDayData.total_active_time || 1)) * 100)}%` 
                              }}
                            ></div>
                          </div>
                          <div className="w-20 text-right text-sm text-muted-foreground">
                            {formatHours(app.total_time)}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No application usage data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default UserDetailsPage;
