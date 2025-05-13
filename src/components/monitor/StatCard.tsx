
import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type StatCardProps = {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  description, 
  icon,
  trend,
  className 
}) => {
  return (
    <Card className={cn("stat-card", className)}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <h3 className="stat-title">{title}</h3>
          {icon && <div className="text-muted-foreground">{icon}</div>}
        </div>
      </CardHeader>
      <CardContent>
        <div className="stat-value">{value}</div>
        {(description || trend) && (
          <div className="flex items-center space-x-2">
            {trend && (
              <span className={`text-xs font-medium ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
              </span>
            )}
            {description && <p className="stat-description">{description}</p>}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
