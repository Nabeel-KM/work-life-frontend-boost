
import React, { useId } from 'react';
import { VirtualList } from '../ui/virtual-list';
import EmployeeCard, { EmployeeType } from './EmployeeCard';

type EmployeeListProps = {
  employees: EmployeeType[];
  maxHeight?: number;
}

const EmployeeList: React.FC<EmployeeListProps> = ({ 
  employees,
  maxHeight = 600
}) => {
  const listId = useId();
  
  // If few employees, no need for virtualization
  if (employees.length <= 10) {
    return (
      <div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        role="list"
        aria-label="Employee list"
      >
        {employees.map((employee, index) => (
          <div 
            key={employee.id} 
            role="listitem"
            aria-posinset={index + 1} 
            aria-setsize={employees.length}
          >
            <EmployeeCard employee={employee} />
          </div>
        ))}
      </div>
    );
  }

  // For larger lists, use virtualization for performance
  return (
    <div aria-label="Virtualized employee list">
      <VirtualList
        items={employees}
        height={maxHeight}
        estimateSize={200} // Approximate height of employee card
        itemKey={(index) => employees[index].id || index}
        className="overflow-auto"
        renderItem={(employee, index) => (
          <div 
            className="p-2"
            role="listitem"
            aria-posinset={index + 1} 
            aria-setsize={employees.length}
          >
            <EmployeeCard employee={employee} />
          </div>
        )}
      />
    </div>
  );
};

export default EmployeeList;
