
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to monitoring page
    navigate('/monitoring');
  }, [navigate]);

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="animate-pulse">Redirecting to monitoring dashboard...</div>
    </div>
  );
};

export default Index;
