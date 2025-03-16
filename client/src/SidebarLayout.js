import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useUser } from './UserContext'; // Import the useUser hook

const SidebarLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useUser(); // Get the user from the context

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove the token from localStorage
    navigate('/login'); // Redirect to login page
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className={`fixed inset-y-0 left-0 w-64 bg-white shadow-md transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
        <div className="p-4">
          <h2 className="mb-4 text-2xl font-bold">Portfolio Generator</h2>
          <ul className="space-y-2">
            <li>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  isActive ? 'block px-4 py-2 text-white bg-indigo-600 rounded-md' : 'block px-4 py-2 text-gray-700 rounded-md hover:bg-gray-200'
                }
              >
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/all-portfolios"
                className={({ isActive }) =>
                  isActive ? 'block px-4 py-2 text-white bg-indigo-600 rounded-md' : 'block px-4 py-2 text-gray-700 rounded-md hover:bg-gray-200'
                }
              >
                All Portfolios
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
      <div className={`flex-1 ${isSidebarOpen ? 'ml-64' : ''}`}>
        <header className="flex items-center justify-between p-4 bg-white shadow-md">
          <button onClick={toggleSidebar} className="text-gray-600 hover:text-gray-900 focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
          <div className="relative">
            <button onClick={toggleProfileMenu} className="flex items-center text-gray-600 hover:text-gray-900 focus:outline-none">
              <span className="mr-2">{user ? user.name : 'User'}</span>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A1 1 0 016 17h12a1 1 0 01.879 1.516l-6 8a1 1 0 01-1.758 0l-6-8A1 1 0 015.121 17.804z"></path>
              </svg>
            </button>
            {isProfileMenuOpen && (
              <div className="absolute right-0 w-48 mt-2 bg-white rounded-md shadow-lg">
                <NavLink to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Profile</NavLink>
                <button onClick={handleLogout} className="block w-full px-4 py-2 text-center text-gray-700 hover:bg-gray-100">Logout</button>
              </div>
            )}
          </div>
        </header>
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SidebarLayout;