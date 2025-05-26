import React from 'react';
import { Link } from 'react-router-dom';
import { Check, Info, Settings, Zap } from 'lucide-react';
import { cn } from "@/lib/utils";

type SidebarProps = {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const navigationItems = [
    {
      title: 'Dashboard',
      icon: <Zap className="w-5 h-5" />,
      href: '/'
    },
    {
      title: 'Monitoring',
      icon: <Check className="w-5 h-5" />,
      href: '/monitoring'
    },
    {
      title: 'Settings',
      icon: <Settings className="w-5 h-5" />,
      href: '/settings'
    },
    {
      title: 'About',
      icon: <Info className="w-5 h-5" />,
      href: '/about'
    }
  ];

  return (
    <div className={cn("flex flex-col h-full border-r bg-sidebar", className)}>
      <div className="p-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <span className="text-white font-bold">WM</span>
          </div>
          <h1 className="text-xl font-bold text-sidebar-foreground">WFH Monitor</h1>
        </div>
      </div>
      
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navigationItems.map((item) => (
          <Link
            key={item.title}
            to={item.href}
            className={cn(
              "flex items-center px-3 py-3 text-sidebar-foreground rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors",
              item.href === '/' && "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
          >
            {item.icon}
            <span className="ml-3">{item.title}</span>
          </Link>
        ))}
      </nav>
      
      <div className="p-4 border-t">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
            <span className="text-secondary-foreground font-medium">A</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium">Admin User</span>
            <span className="text-xs text-muted-foreground">admin@example.com</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;