import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format, subDays } from "date-fns";
import { api, UserHistory, Screenshot } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Calendar, ArrowLeft, ChevronLeft, ChevronRight, X, Activity, Clock, User, ZoomIn, ZoomOut } from "lucide-react";
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
  const [selectedScreenshot, setSelectedScreenshot] = useState<number | null>(null);

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
        console.log("History data received:", data);
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
    setSelectedScreenshot(null);
    
    api.fetchScreenshots(username, selectedDate)
      .then(data => {
        console.log("Screenshots data received:", data);
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

  // Handle navigation between screenshots
  const [zoomLevel, setZoomLevel] = useState(1);
  
  const handleScreenshotClick = (index: number) => {
    setSelectedScreenshot(index);
    setZoomLevel(1); // Reset zoom when opening a new screenshot
  };
  
  const handlePrevious = () => {
    if (selectedScreenshot !== null && screenshots.length > 0) {
      setSelectedScreenshot((prev) => (prev === 0 ? screenshots.length - 1 : prev - 1));
      setZoomLevel(1); // Reset zoom when changing screenshots
    }
  };
  
  const handleNext = () => {
    if (selectedScreenshot !== null && screenshots.length > 0) {
      setSelectedScreenshot((prev) => (prev === screenshots.length - 1 ? 0 : prev + 1));
      setZoomLevel(1); // Reset zoom when changing screenshots
    }
  };
  
  const closePreview = () => {
    setSelectedScreenshot(null);
    setZoomLevel(1); // Reset zoom when closing
  };
  
  const zoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.25, 3)); // Max zoom 3x
  };
  
  const zoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.25, 0.5)); // Min zoom 0.5x
  };

  // Render screenshot preview modal
  const renderScreenshotPreview = () => {
    if (selectedScreenshot === null || screenshots.length === 0) return null;
    
    return (
      <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
        <div className="relative w-full h-full flex flex-col items-center justify-center p-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-4 right-4 rounded-full bg-black/20 hover:bg-black/40 text-white"
            onClick={closePreview}
          >
            <X className="h-6 w-6" />
          </Button>
          
          <div className="relative max-w-5xl max-h-[80vh] w-full h-full flex items-center justify-center">
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute left-2 rounded-full bg-black/20 hover:bg-black/40 text-white"
              onClick={handlePrevious}
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>
            
            <img 
              src={screenshots[selectedScreenshot].url} 
              alt={`Screenshot ${selectedScreenshot + 1}`}
              className="max-w-full max-h-full object-contain transition-transform duration-200"
              style={{ transform: `scale(${zoomLevel})` }}
            />
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-2 rounded-full bg-black/20 hover:bg-black/40 text-white"
              onClick={handleNext}
            >
              <ChevronRight className="h-8 w-8" />
            </Button>
          </div>
          
          <div className="mt-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full bg-black/20 hover:bg-black/40 text-white"
                onClick={zoomOut}
              >
                <ZoomOut className="h-5 w-5" />
              </Button>
              <span className="bg-black/40 px-3 py-1 rounded-md text-white text-sm">
                {Math.round(zoomLevel * 100)}%
              </span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full bg-black/20 hover:bg-black/40 text-white"
                onClick={zoomIn}
              >
                <ZoomIn className="h-5 w-5" />
              </Button>
            </div>
            <div className="bg-black/40 px-4 py-2 rounded-md text-white">
              {formatTimeOnly(screenshots[selectedScreenshot].last_modified)}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950/20">
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => navigate('/monitoring')}
                className="mr-2"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent">{displayName}</h1>
                </div>
                <p className="text-gray-600 dark:text-gray-400">Activity and monitoring details</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
          <div className="flex flex-col md:flex-row gap-6">
            <Card className="flex-1 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardHeader className="pb-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 dark:from-white dark:to-blue-200 bg-clip-text text-transparent">Select Date</CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400 mt-2">View data for a specific date</CardDescription>
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Calendar className="h-5 w-5 text-white" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex flex-wrap gap-2">
                  {pastDates.map((date) => (
                    <Button
                      key={date.value}
                      variant={selectedDate === date.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedDate(date.value)}
                      className={`flex items-center gap-2 ${selectedDate === date.value ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md' : ''}`}
                    >
                      <Calendar className="h-4 w-4" />
                      {date.label}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {selectedDayData && (
              <Card className="flex-1 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300">
                <CardHeader className="pb-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 rounded-t-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 dark:from-white dark:to-blue-200 bg-clip-text text-transparent">Daily Summary</CardTitle>
                      <CardDescription className="text-gray-600 dark:text-gray-400 mt-2">{selectedDate}</CardDescription>
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Activity className="h-5 w-5 text-white" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-secondary/10 p-4 rounded-md hover:bg-secondary/20 transition-colors">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Time</p>
                      <p className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 dark:from-white dark:to-blue-200 bg-clip-text text-transparent">{formatMinutesToTime(selectedDayData.total_active_time * 60)}</p>
                    </div>
                    <div className="bg-secondary/10 p-4 rounded-md hover:bg-secondary/20 transition-colors">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Session Time</p>
                      <p className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 dark:from-white dark:to-blue-200 bg-clip-text text-transparent">{selectedDayData.total_session_time.toFixed(1)}h</p>
                    </div>
                    <div className="bg-secondary/10 p-4 rounded-md hover:bg-secondary/20 transition-colors">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">First Activity</p>
                      <p className="text-lg font-medium">{formatTimeOnly(selectedDayData.first_activity)}</p>
                    </div>
                    <div className="bg-secondary/10 p-4 rounded-md hover:bg-secondary/20 transition-colors">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Last Activity</p>
                      <p className="text-lg font-medium">{formatTimeOnly(selectedDayData.last_activity)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <Tabs value={tabValue} onValueChange={setTabValue} className="w-full mt-6">
            <TabsList className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 p-1 rounded-lg">
              <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white">Activity Overview</TabsTrigger>
              <TabsTrigger value="screenshots" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white">Screenshots</TabsTrigger>
              <TabsTrigger value="applications" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white">Applications</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-6">
              <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300">
                <CardHeader className="pb-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 rounded-t-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 dark:from-white dark:to-blue-200 bg-clip-text text-transparent">Activity History</CardTitle>
                      <CardDescription className="text-gray-600 dark:text-gray-400 mt-2">Past 7 days of user activity</CardDescription>
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Clock className="h-5 w-5 text-white" />
                    </div>
                  </div>
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
                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border border-green-200/50 dark:border-green-800/50 p-4 rounded-md shadow-md hover:shadow-lg transition-all duration-300">
                              <div className="text-sm text-gray-600 dark:text-gray-400">Active Time</div>
                              <div className="text-2xl font-bold mt-1 bg-gradient-to-r from-gray-900 to-green-900 dark:from-white dark:to-green-200 bg-clip-text text-transparent">{formatMinutesToTime(day.total_active_time * 60)}</div>
                            </div>
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200/50 dark:border-blue-800/50 p-4 rounded-md shadow-md hover:shadow-lg transition-all duration-300">
                              <div className="text-sm text-gray-600 dark:text-gray-400">Session Time</div>
                              <div className="text-2xl font-bold mt-1 bg-gradient-to-r from-gray-900 to-blue-900 dark:from-white dark:to-blue-200 bg-clip-text text-transparent">{day.total_session_time.toFixed(1)}h</div>
                            </div>
                            <div className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/30 dark:to-violet-950/30 border border-purple-200/50 dark:border-purple-800/50 p-4 rounded-md shadow-md hover:shadow-lg transition-all duration-300">
                              <div className="text-sm text-gray-600 dark:text-gray-400">Most Used App</div>
                              <div className="text-xl font-bold mt-1 bg-gradient-to-r from-gray-900 to-purple-900 dark:from-white dark:to-purple-200 bg-clip-text text-transparent">{day.most_used_app || "N/A"}</div>
                              {day.most_used_app_time > 0 && (
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                  {formatHours(day.most_used_app_time)}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="mt-4">
                            <Button 
                              size="sm" 
                              onClick={() => {
                                setSelectedDate(day.date);
                                setTabValue("screenshots");
                              }}
                              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
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
              <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300">
                <CardHeader className="pb-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 rounded-t-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 dark:from-white dark:to-blue-200 bg-clip-text text-transparent">Screenshots for {selectedDate}</CardTitle>
                      <CardDescription className="text-gray-600 dark:text-gray-400 mt-2">
                        Screenshots captured throughout the day
                      </CardDescription>
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Activity className="h-5 w-5 text-white" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoadingScreenshots ? (
                    <div className="flex justify-center py-12">
                      <div className="animate-pulse">Loading screenshots...</div>
                    </div>
                  ) : screenshots.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {screenshots.map((screenshot, index) => (
                        <div 
                          key={index} 
                          className="border border-gray-200/50 dark:border-gray-700/50 rounded-lg overflow-hidden bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] cursor-pointer"
                          onClick={() => handleScreenshotClick(index)}
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
                          <div className="p-2 text-center bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50">
                            <p className="text-xs text-gray-600 dark:text-gray-400">
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
              <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300">
                <CardHeader className="pb-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 rounded-t-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 dark:from-white dark:to-blue-200 bg-clip-text text-transparent">Application Usage for {selectedDate}</CardTitle>
                      <CardDescription className="text-gray-600 dark:text-gray-400 mt-2">
                        Applications used throughout the day
                      </CardDescription>
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Activity className="h-5 w-5 text-white" />
                    </div>
                  </div>
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
                          <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.01]">
                            <div className="font-medium text-gray-900 dark:text-gray-100">{app.app_name}</div>
                            <div className="flex items-center gap-4">
                              <div className="w-48 h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
                                <div 
                                  className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"
                                  style={{ 
                                    width: `${Math.min(100, (app.total_time / (selectedDayData.total_active_time || 1)) * 100)}%` 
                                  }}
                                ></div>
                              </div>
                              <div className="w-20 text-right text-sm font-medium text-gray-600 dark:text-gray-400">
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
          
          {renderScreenshotPreview()}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserDetailsPage;