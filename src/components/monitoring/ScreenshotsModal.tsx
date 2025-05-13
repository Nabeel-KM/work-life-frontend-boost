
import React, { useEffect, useState } from "react";
import { api, Screenshot } from "@/lib/api";
import { formatTimeOnly } from "@/lib/utils-format";
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
import { User, Calendar } from "lucide-react";

interface ScreenshotsModalProps {
  isOpen: boolean;
  onClose: () => void;
  username: string | null;
  date: string;
}

const ScreenshotsModal = ({ isOpen, onClose, username, date }: ScreenshotsModalProps) => {
  const [screenshots, setScreenshots] = useState<Screenshot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && username) {
      setIsLoading(true);
      setError(null);

      api.fetchScreenshots(username, date)
        .then(data => {
          setScreenshots(data);
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
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
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
                <div 
                  key={screenshot.key} 
                  className="rounded-md border overflow-hidden flex flex-col"
                >
                  <a 
                    href={screenshot.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block overflow-hidden h-40"
                  >
                    <img 
                      src={screenshot.url} 
                      alt={`Screenshot ${index + 1}`}
                      className="w-full h-full object-cover transition-transform hover:scale-105"
                      loading="lazy"
                    />
                  </a>
                  <div className="p-2 text-center bg-gray-50 dark:bg-gray-800">
                    <p className="text-xs text-muted-foreground">
                      {formatTimeOnly(screenshot.last_modified)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center h-64">
              <p className="text-muted-foreground">No screenshots available for this date</p>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ScreenshotsModal;
