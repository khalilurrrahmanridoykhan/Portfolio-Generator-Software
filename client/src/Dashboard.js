import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen p-8 bg-gray-100">
      <h2 className="text-2xl font-bold text-center text-gray-900">Dashboard</h2>
       <br/>
      <p className="text-center text-gray-700">Welcome to the dashboard!</p>
    </div>
  );
};

export default Dashboard;