
import React from 'react';
import { cn } from "@/lib/utils";

type StatusType = 'online' | 'offline' | 'idle';

type StatusBadgeProps = {
  status: StatusType;
  className?: string;
}

const statusClasses: Record<StatusType, string> = {
  online: 'status-badge-online',
  offline: 'status-badge-offline',
  idle: 'status-badge-idle',
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const statusText = status.charAt(0).toUpperCase() + status.slice(1);
  
  return (
    <span className={cn(statusClasses[status], className)}>
      <span className={`inline-block w-2 h-2 mr-1.5 rounded-full bg-${status === 'online' ? 'green' : status === 'offline' ? 'red' : 'yellow'}-500`}></span>
      {statusText}
    </span>
  );
};

export default StatusBadge;
