
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string;
  description: string;
  icon?: React.ReactNode;
  trend?: number;
  suffix?: string;
  className?: string;
}

const StatsCard = ({
  title,
  value,
  description,
  icon,
  trend,
  suffix = "",
  className,
}: StatsCardProps) => {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-x-2">
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          {icon && <div className="text-muted-foreground">{icon}</div>}
        </div>
        <div className="mt-2">
          <div className="flex items-baseline space-x-1">
            <p className="text-3xl font-bold">{value}</p>
            {suffix && <span className="text-base">{suffix}</span>}
          </div>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
          
          {trend !== undefined && (
            <div className="flex items-center mt-3">
              <span
                className={cn(
                  "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium",
                  trend > 50 
                    ? "bg-green-100 text-green-800"
                    : trend > 20
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                )}
              >
                {trend}%
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
