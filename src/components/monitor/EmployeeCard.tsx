
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import StatusBadge from './StatusBadge';
import { formatTimeOnly, formatMinutesToTime } from '@/lib/utils-time';

export type EmployeeType = {
  id: string;
  name: string;
  avatar?: string;
  email: string;
  status: 'online' | 'offline' | 'idle';
  department: string;
  lastActive: string;
  workTime?: string;
  screenshots?: number;
}

type EmployeeCardProps = {
  employee: EmployeeType;
}

const EmployeeCard: React.FC<EmployeeCardProps> = ({ employee }) => {
  return (
    <Card className="animate-fade-in">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
              {employee.avatar ? (
                <img 
                  src={employee.avatar} 
                  alt={employee.name} 
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <span className="text-sm font-medium">
                  {employee.name.split(' ').map(n => n[0]).join('')}
                </span>
              )}
            </div>
            <div>
              <h3 className="font-medium">{employee.name}</h3>
              <p className="text-xs text-muted-foreground">{employee.department}</p>
            </div>
          </div>
          <StatusBadge status={employee.status} />
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-xs text-muted-foreground">Email</p>
            <p className="truncate">{employee.email}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Last Activity</p>
            <p>{formatTimeOnly(employee.lastActive)}</p>
          </div>
          {employee.workTime && (
            <div>
              <p className="text-xs text-muted-foreground">Work Time</p>
              <p>{employee.workTime}</p>
            </div>
          )}
          {employee.screenshots !== undefined && (
            <div>
              <p className="text-xs text-muted-foreground">Screenshots</p>
              <p>{employee.screenshots}</p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <div className="w-full flex justify-end">
          <a href={`/employee/${employee.id}`} className="text-xs text-primary hover:underline">View Details</a>
        </div>
      </CardFooter>
    </Card>
  );
};

export default EmployeeCard;
