
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
      <main 
        className={cn("flex-1 overflow-y-auto p-8", className)}
        role="main"
        tabIndex={-1}
        id="main-content"
        aria-label="Main content"
      >
        {/* Skip to main content link for keyboard users */}
        <a 
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:p-3 focus:bg-primary focus:text-primary-foreground focus:z-50"
        >
          Skip to main content
        </a>
        {children}
      </main>
    </div>
  );
};

export default Layout;
