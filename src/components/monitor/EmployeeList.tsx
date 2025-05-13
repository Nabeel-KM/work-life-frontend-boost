
import React from 'react';
import EmployeeCard, { EmployeeType } from './EmployeeCard';

type EmployeeListProps = {
  employees: EmployeeType[];
}

const EmployeeList: React.FC<EmployeeListProps> = ({ employees }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {employees.map((employee) => (
        <EmployeeCard key={employee.id} employee={employee} />
      ))}
    </div>
  );
};

export default EmployeeList;
