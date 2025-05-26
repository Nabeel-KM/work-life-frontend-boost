
import React, { useEffect, useState, memo, useCallback } from "react";
import { api, Screenshot } from "@/lib/api";
import { formatTimeOnly } from "@/lib/utils-time";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { User, Calendar, ChevronLeft, ChevronRight, X } from "lucide-react";

interface ScreenshotsModalProps {
  isOpen: boolean;
  onClose: () => void;
  username: string | null;
  date: string;
}

// Memoized screenshot item component
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
    className="rounded-md border overflow-hidden flex flex-col cursor-pointer"
    onClick={() => onClick(index)}
  >
    <div className="block overflow-hidden h-40">
      <img 
        src={screenshot.url} 
        alt={`Screenshot ${index + 1}`}
        className="w-full h-full object-cover transition-transform hover:scale-105"
        loading="lazy"
      />
    </div>
    <div className="p-2 text-center bg-gray-50 dark:bg-gray-800">
      <p className="text-xs text-muted-foreground">
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

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);
  
  const handleScreenshotClick = useCallback((index: number) => {
    setSelectedScreenshot(index);
  }, []);
  
  const handlePrevious = useCallback(() => {
    if (selectedScreenshot !== null && screenshots.length > 0) {
      setSelectedScreenshot((prev) => (prev === 0 ? screenshots.length - 1 : prev - 1));
    }
  }, [selectedScreenshot, screenshots.length]);
  
  const handleNext = useCallback(() => {
    if (selectedScreenshot !== null && screenshots.length > 0) {
      setSelectedScreenshot((prev) => (prev === screenshots.length - 1 ? 0 : prev + 1));
    }
  }, [selectedScreenshot, screenshots.length]);
  
  const closePreview = useCallback(() => {
    setSelectedScreenshot(null);
  }, []);

  useEffect(() => {
    if (isOpen && username) {
      setIsLoading(true);
      setError(null);
      setSelectedScreenshot(null);

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
    <Dialog open={isOpen} onOpenChange={open => !open && handleClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Screenshots</DialogTitle>
          <DialogDescription>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-1.5">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{username || "User"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{date}</span>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
        
        <Separator className="my-2" />
        
        <div className="flex-1 overflow-y-auto py-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-pulse">Loading screenshots...</div>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-red-500">{error}</div>
            </div>
          ) : screenshots.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {screenshots.map((screenshot, index) => (
                <ScreenshotItem 
                  key={screenshot.key}
                  screenshot={screenshot} 
                  index={index}
                  onClick={handleScreenshotClick}
                />
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center h-64">
              <p className="text-muted-foreground">No screenshots available for this date</p>
            </div>
          )}
          
          {/* Screenshot Preview Modal */}
          {selectedScreenshot !== null && screenshots.length > 0 && (
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
                    className="max-w-full max-h-full object-contain"
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
                
                <div className="mt-4 bg-black/40 px-4 py-2 rounded-md text-white">
                  {formatTimeOnly(screenshots[selectedScreenshot].last_modified)}
                </div>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button onClick={handleClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

ScreenshotsModal.displayName = "ScreenshotsModal";

export default ScreenshotsModal;
