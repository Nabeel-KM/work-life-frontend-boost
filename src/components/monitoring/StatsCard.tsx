
import React, { memo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  description: string;
  icon?: React.ReactNode;
  trend?: number;
  suffix?: string;
  className?: string;
  valueClassName?: string;
}

const getTrendColor = (trend: number) => {
  if (trend > 50) return "bg-green-100 text-green-800";
  if (trend > 20) return "bg-yellow-100 text-yellow-800";
  return "bg-red-100 text-red-800";
};

const StatsCard = memo(({
  title,
  value,
  description,
  icon,
  trend,
  suffix = "",
  className,
  valueClassName = "text-3xl",
}: StatsCardProps) => (
  <Card className={cn("overflow-hidden", className)}>
    <CardContent className="p-4 lg:p-6">
      <div className="flex items-center justify-between space-x-2">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </div>
      <div className="mt-2">
        <div className="flex items-baseline space-x-1">
          <p className={cn("font-bold", valueClassName)}>{value}</p>
          {suffix && <span className="text-base">{suffix}</span>}
        </div>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
        
        {trend !== undefined && (
          <div className="flex items-center mt-3">
            <span
              className={cn(
                "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium",
                getTrendColor(trend)
              )}
            >
              {trend}%
            </span>
          </div>
        )}
      </div>
    </CardContent>
  </Card>
));

StatsCard.displayName = "StatsCard";

export default StatsCard;
