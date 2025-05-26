
import React from 'react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/theme-toggle";

type HeaderProps = {
  title?: string;
  subtitle?: string;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ 
  title = "Dashboard", 
  subtitle = "Monitor your work-from-home employees efficiently", 
  className 
}) => {
  return (
    <header className={cn("pb-5 border-b", className)}>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-muted-foreground">{subtitle}</p>
        </div>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <Button>Refresh Data</Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
