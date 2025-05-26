import React from "react";
import DarkModeToggle from "../layout/DarkModeToggle";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-end mb-4">
          <DarkModeToggle />
        </div>
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;