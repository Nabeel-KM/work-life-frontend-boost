
import React, { memo } from 'react';
import EmployeeCard, { EmployeeType } from './EmployeeCard';

type EmployeeListProps = {
  employees: EmployeeType[];
  isLoading?: boolean;
}

const EmptyState = () => (
  <div className="col-span-full flex flex-col items-center justify-center py-10 text-center">
    <p className="text-muted-foreground mb-2">No employees available</p>
    <p className="text-sm text-muted-foreground">Try refreshing the data or check your connection</p>
  </div>
);

const LoadingState = () => (
  <>
    {[...Array(3)].map((_, index) => (
      <div 
        key={`skeleton-${index}`} 
        className="h-[200px] bg-muted animate-pulse rounded-lg"
      ></div>
    ))}
  </>
);

const EmployeeList: React.FC<EmployeeListProps> = ({ employees, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <LoadingState />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {employees.length > 0 ? (
        employees.map((employee) => (
          <EmployeeCard 
            key={employee.id} 
            employee={employee} 
          />
        ))
      ) : (
        <EmptyState />
      )}
    </div>
  );
};

export default memo(EmployeeList);
