
import React, { useEffect, useState, memo, useCallback } from "react";
import { api, Screenshot } from "@/lib/api";
import { formatTimeOnly } from "@/lib/utils-time";
import { Button } from "@/components/ui/button";
import { LazyImage } from "@/components/ui/lazy-image";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { User, Calendar, ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut, ArrowLeft } from "lucide-react";

interface ScreenshotsModalProps {
  isOpen: boolean;
  onClose: () => void;
  username: string | null;
  date: string;
}

// Memoized screenshot item component with enhanced styling
const ScreenshotItem = memo(({ 
  screenshot, 
  index, 
  onClick 
}: { 
  screenshot: Screenshot; 
  index: number;
  onClick: (index: number) => void;
}) => (
  <div 
    key={screenshot.key} 
    className="group rounded-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden flex flex-col cursor-pointer bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm hover:shadow-xl hover:shadow-blue-100/20 dark:hover:shadow-blue-900/20 hover:border-blue-300/50 dark:hover:border-blue-700/50 transition-all duration-300 hover:scale-[1.02]"
    onClick={() => onClick(index)}
  >
    <div className="block overflow-hidden h-40 relative">
      <LazyImage 
        src={screenshot.url} 
        alt={`Screenshot ${index + 1}`}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>
    <div className="p-3 text-center bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 border-t border-gray-200/30 dark:border-gray-700/30">
      <p className="text-xs font-medium text-gray-600 dark:text-gray-300">
        {formatTimeOnly(screenshot.last_modified)}
      </p>
    </div>
  </div>
));

ScreenshotItem.displayName = "ScreenshotItem";

const ScreenshotsModal = memo(({ isOpen, onClose, username, date }: ScreenshotsModalProps) => {
  const [screenshots, setScreenshots] = useState<Screenshot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedScreenshot, setSelectedScreenshot] = useState<number | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  const handleClose = useCallback(() => {
    onClose();
    setSelectedScreenshot(null);
  }, [onClose]);
  
  const handleScreenshotClick = useCallback((index: number) => {
    setSelectedScreenshot(index);
    setZoomLevel(1);
  }, []);
  
  const handlePrevious = useCallback(() => {
    if (selectedScreenshot !== null && screenshots.length > 0) {
      setSelectedScreenshot((prev) => (prev === 0 ? screenshots.length - 1 : prev - 1));
      setZoomLevel(1);
    }
  }, [selectedScreenshot, screenshots.length]);
  
  const handleNext = useCallback(() => {
    if (selectedScreenshot !== null && screenshots.length > 0) {
      setSelectedScreenshot((prev) => (prev === screenshots.length - 1 ? 0 : prev + 1));
      setZoomLevel(1);
    }
  }, [selectedScreenshot, screenshots.length]);
  
  const closePreview = useCallback(() => {
    setSelectedScreenshot(null);
    setZoomLevel(1);
  }, []);
  
  const zoomIn = useCallback(() => {
    setZoomLevel(prev => Math.min(prev + 0.25, 3));
  }, []);
  
  const zoomOut = useCallback(() => {
    setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
  }, []);

  // Navigate back to grid view
  const goBackToGrid = useCallback(() => {
    setSelectedScreenshot(null);
    setZoomLevel(1);
  }, []);

  useEffect(() => {
    if (isOpen && username) {
      setIsLoading(true);
      setError(null);
      setSelectedScreenshot(null);
      setZoomLevel(1);

      api.fetchScreenshots(username, date)
        .then(data => {
          console.log("Modal screenshots data:", data);
          setScreenshots(Array.isArray(data) ? data : []);
        })
        .catch(err => {
          console.error('Error fetching screenshots:', err);
          setError('Failed to load screenshots');
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [isOpen, username, date]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden flex flex-col bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-gray-200/50 dark:border-gray-700/50 shadow-2xl">
        <ErrorBoundary>
        {/* Enhanced Header */}
        <DialogHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 -mx-6 -mt-6 px-6 pt-6 pb-4 border-b border-gray-200/30 dark:border-gray-700/30">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 dark:from-white dark:to-blue-200 bg-clip-text text-transparent">
                Screenshots Gallery
              </DialogTitle>
              <DialogDescription className="mt-2">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <span className="font-medium text-gray-700 dark:text-gray-300">{username || "User"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <span className="font-medium text-gray-700 dark:text-gray-300">{date}</span>
                  </div>
                  {screenshots.length > 0 && (
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {screenshots.length} screenshot{screenshots.length !== 1 ? 's' : ''} found
                    </div>
                  )}
                </div>
              </DialogDescription>
            </div>
            {selectedScreenshot !== null && (
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 border-gray-300 dark:border-gray-600"
                onClick={goBackToGrid}
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Grid
              </Button>
            )}
          </div>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto py-6">
          {isLoading ? (
            <div className="flex flex-col justify-center items-center h-96 gap-6">
              <div className="relative">
                <LoadingSpinner size="lg" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full animate-pulse opacity-20"></div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-lg font-medium text-gray-700 dark:text-gray-300">Loading screenshots...</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Fetching images from the server</div>
              </div>
            </div>
          ) : error ? (
            <div className="flex flex-col justify-center items-center h-96 gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-red-100 to-red-200 dark:from-red-900/50 dark:to-red-800/50 rounded-full flex items-center justify-center">
                <X className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
              <div className="text-center space-y-2">
                <div className="text-lg font-medium text-red-600 dark:text-red-400">{error}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Please try again later</div>
              </div>
            </div>
          ) : screenshots.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-2">
              {screenshots.map((screenshot, index) => (
                <div 
                  key={screenshot.key}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <ScreenshotItem 
                    screenshot={screenshot} 
                    index={index}
                    onClick={handleScreenshotClick}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center h-96 gap-6">
              <div className="w-20 h-20 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center">
                <Calendar className="h-10 w-10 text-gray-500 dark:text-gray-400" />
              </div>
              <div className="text-center space-y-2">
                <div className="text-xl font-semibold text-gray-600 dark:text-gray-400">No Screenshots Available</div>
                <div className="text-sm text-gray-500 dark:text-gray-500">No screenshots were captured for this date</div>
              </div>
            </div>
          )}
          
          {/* Enhanced Screenshot Preview Modal */}
          {selectedScreenshot !== null && screenshots.length > 0 && (
            <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in">
              <div className="relative w-full h-full flex flex-col items-center justify-center p-4">
                {/* Top Controls */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="flex items-center gap-2 rounded-full bg-black/40 hover:bg-black/60 text-white border border-white/20"
                    onClick={goBackToGrid}
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Grid
                  </Button>
                  
                  <div className="bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full text-white border border-white/20">
                    {selectedScreenshot + 1} of {screenshots.length}
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-full bg-black/40 hover:bg-black/60 text-white border border-white/20"
                    onClick={closePreview}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                
                <div className="relative max-w-6xl max-h-[80vh] w-full h-full flex items-center justify-center">
                  {/* Left Navigation */}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute left-4 z-10 rounded-full bg-black/40 hover:bg-black/60 text-white border border-white/20 w-12 h-12"
                    onClick={handlePrevious}
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                  
                  <img 
                    src={screenshots[selectedScreenshot].url} 
                    alt={`Screenshot ${selectedScreenshot + 1}`}
                    className="max-w-full max-h-full object-contain transition-transform duration-300 rounded-lg shadow-2xl"
                    style={{ transform: `scale(${zoomLevel})` }}
                  />
                  
                  {/* Right Navigation */}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute right-4 z-10 rounded-full bg-black/40 hover:bg-black/60 text-white border border-white/20 w-12 h-12"
                    onClick={handleNext}
                  >
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                </div>
                
                {/* Bottom Controls */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-4">
                  <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="rounded-full hover:bg-white/20 text-white w-8 h-8"
                      onClick={zoomOut}
                    >
                      <ZoomOut className="h-4 w-4" />
                    </Button>
                    <span className="text-white text-sm font-medium min-w-[3rem] text-center">
                      {Math.round(zoomLevel * 100)}%
                    </span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="rounded-full hover:bg-white/20 text-white w-8 h-8"
                      onClick={zoomIn}
                    >
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full text-white border border-white/20">
                    {formatTimeOnly(screenshots[selectedScreenshot].last_modified)}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter className="border-t border-gray-200/30 dark:border-gray-700/30 pt-4">
          <Button 
            onClick={handleClose}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Close Gallery
          </Button>
        </DialogFooter>
        </ErrorBoundary>
      </DialogContent>
    </Dialog>
  );
});

ScreenshotsModal.displayName = "ScreenshotsModal";

export default ScreenshotsModal;
