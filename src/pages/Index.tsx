
import React from 'react';
import Layout from '@/components/layout/Layout';
import Header from '@/components/layout/Header';
import StatCard from '@/components/monitor/StatCard';
import EmployeeList from '@/components/monitor/EmployeeList';
import { Check, Info, Settings, Zap } from 'lucide-react';
import { EmployeeType } from '@/components/monitor/EmployeeCard';

// Mock data - this would be fetched from your API
const mockEmployees: EmployeeType[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@example.com',
    status: 'online',
    department: 'Engineering',
    lastActive: '2 min ago',
    workTime: '7h 15m',
    screenshots: 12
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    status: 'idle',
    department: 'Design',
    lastActive: '15 min ago',
    workTime: '6h 30m',
    screenshots: 8
  },
  {
    id: '3',
    name: 'Michael Brown',
    email: 'michael.b@example.com',
    status: 'offline',
    department: 'Marketing',
    lastActive: '1h ago',
    workTime: '4h 45m',
    screenshots: 5
  },
  {
    id: '4',
    name: 'Emma Wilson',
    email: 'emma.w@example.com',
    status: 'online',
    department: 'HR',
    lastActive: '5 min ago',
    workTime: '7h 50m',
    screenshots: 14
  },
  {
    id: '5',
    name: 'David Lee',
    email: 'david.l@example.com',
    status: 'online',
    department: 'Engineering',
    lastActive: '1 min ago',
    workTime: '7h 05m',
    screenshots: 10
  },
  {
    id: '6',
    name: 'Jennifer Garcia',
    email: 'jennifer.g@example.com',
    status: 'offline',
    department: 'Sales',
    lastActive: '3h ago',
    workTime: '3h 20m',
    screenshots: 3
  }
];

const Index = () => {
  return (
    <Layout>
      <Header 
        title="Monitoring Dashboard" 
        subtitle="Track and manage your remote workforce in real-time"
      />
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Active Employees" 
          value="3" 
          description="Currently working" 
          icon={<Check className="w-5 h-5" />}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard 
          title="Idle Employees" 
          value="1" 
          description="Away from keyboard" 
          icon={<Info className="w-5 h-5" />}
          trend={{ value: 5, isPositive: false }}
        />
        <StatCard 
          title="Offline Employees" 
          value="2" 
          description="Not currently working" 
          icon={<Settings className="w-5 h-5" />}
        />
        <StatCard 
          title="Total Working Hours" 
          value="36h 45m" 
          description="Today's progress" 
          icon={<Zap className="w-5 h-5" />}
          trend={{ value: 8, isPositive: true }}
        />
      </div>
      
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Team Members</h2>
          <div className="text-sm text-muted-foreground">Showing all 6 employees</div>
        </div>
        <EmployeeList employees={mockEmployees} />
      </div>
    </Layout>
  );
};

export default Index;
