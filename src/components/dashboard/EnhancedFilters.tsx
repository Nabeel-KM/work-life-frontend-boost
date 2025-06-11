
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Filter, Users, Clock } from 'lucide-react';

interface EnhancedFiltersProps {
  onFiltersChange?: (filters: any) => void;
}

const EnhancedFilters = ({ onFiltersChange }: EnhancedFiltersProps) => {
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState('today');

  const quickFilters = [
    { id: 'active-only', label: 'Active Only', icon: <Clock className="h-3 w-3" /> },
    { id: 'idle-10min', label: 'Idle > 10min', icon: <Clock className="h-3 w-3" /> },
    { id: 'high-activity', label: 'High Activity', icon: <Users className="h-3 w-3" /> },
  ];

  const dateRanges = [
    { id: 'today', label: 'Today' },
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
    { id: 'custom', label: 'Custom Range' },
  ];

  const toggleFilter = (filterId: string) => {
    const newFilters = activeFilters.includes(filterId)
      ? activeFilters.filter(f => f !== filterId)
      : [...activeFilters, filterId];
    
    setActiveFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  return (
    <Card className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-gray-200/50 dark:border-gray-700/50 shadow-lg mb-6">
      <CardContent className="p-6">
        <div className="flex flex-wrap items-center gap-4">
          {/* Date Range Selector */}
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <div className="flex gap-1">
              {dateRanges.map(range => (
                <Button
                  key={range.id}
                  variant={dateRange === range.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setDateRange(range.id)}
                  className="text-xs"
                >
                  {range.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Separator */}
          <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>

          {/* Quick Filters */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <div className="flex gap-2">
              {quickFilters.map(filter => (
                <Badge
                  key={filter.id}
                  variant={activeFilters.includes(filter.id) ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary/20 transition-colors"
                  onClick={() => toggleFilter(filter.id)}
                >
                  {filter.icon}
                  {filter.label}
                </Badge>
              ))}
            </div>
          </div>

          {/* Clear Filters */}
          {activeFilters.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setActiveFilters([]);
                onFiltersChange?.([]);
              }}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Clear All
            </Button>
          )}
        </div>

        {/* Active Filters Display */}
        {activeFilters.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span>Active filters:</span>
              <div className="flex gap-1">
                {activeFilters.map(filterId => {
                  const filter = quickFilters.find(f => f.id === filterId);
                  return filter ? (
                    <Badge key={filterId} variant="secondary" className="text-xs">
                      {filter.label}
                    </Badge>
                  ) : null;
                })}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedFilters;
