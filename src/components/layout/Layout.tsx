
import React from 'react';
import Sidebar from './Sidebar';
import { cn } from "@/lib/utils";

type LayoutProps = {
  children: React.ReactNode;
  className?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, className }) => {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar className="w-64 hidden md:flex" />
      <main className={cn("flex-1 overflow-y-auto p-8", className)}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
