
import React, { useEffect, useState, memo, useCallback } from "react";
import { api, UserHistory, HistoryDay } from "@/lib/api";
import { formatDate, formatTimeOnly, formatMinutesToTime, formatHours } from "@/lib/utils-time";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface UserHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
}

// Memoized history row component
const HistoryRow = memo(({ day }: { day: HistoryDay }) => (
  <TableRow>
    <TableCell className="font-medium">{day.date}</TableCell>
    <TableCell>{formatMinutesToTime(day.total_active_time)}</TableCell>
    <TableCell>{formatHours(day.total_session_time)}</TableCell>
    <TableCell>{formatMinutesToTime(day.total_idle_time)}</TableCell>
    <TableCell>{formatTimeOnly(day.first_activity)}</TableCell>
    <TableCell>{formatTimeOnly(day.last_activity)}</TableCell>
    <TableCell>
      {day.most_used_app 
        ? `${day.most_used_app} (${formatMinutesToTime(day.most_used_app_time)})` 
        : 'N/A'}
    </TableCell>
  </TableRow>
));

HistoryRow.displayName = "HistoryRow";

const UserHistoryModal = memo(({ isOpen, onClose, username }: UserHistoryModalProps) => {
  const [history, setHistory] = useState<UserHistory | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (isOpen && username) {
      setIsLoading(true);
      setError(null);

      api.fetchHistory(username, 7)
        .then(data => {
          setHistory(data);
        })
        .catch(err => {
          console.error('Error fetching history:', err);
          setError('Failed to load history data');
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [isOpen, username]);

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && handleClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Activity History</DialogTitle>
          <DialogDescription>
            Viewing the last 7 days of activity for {history?.username || username}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto py-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-pulse">Loading history data...</div>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-40">
              <div className="text-red-500">{error}</div>
            </div>
          ) : history?.days && history.days.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Active Time</TableHead>
                    <TableHead>Session Time</TableHead>
                    <TableHead>Idle Time</TableHead>
                    <TableHead>First Activity</TableHead>
                    <TableHead>Last Activity</TableHead>
                    <TableHead>Most Used App</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.days.map((day, index) => (
                    <HistoryRow key={`${day.date}-${index}`} day={day} />
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex justify-center items-center h-40">
              <p className="text-muted-foreground">No history data available</p>
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

UserHistoryModal.displayName = "UserHistoryModal";

export default UserHistoryModal;
