
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to monitoring page
    navigate('/monitoring');
  }, [navigate]);

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950/20">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg mx-auto">
          <Activity className="h-8 w-8 text-white animate-pulse" />
        </div>
        <div className="text-xl font-medium bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent">
          Redirecting to monitoring dashboard...
        </div>
      </div>
    </div>
  );
};

export default Index;
