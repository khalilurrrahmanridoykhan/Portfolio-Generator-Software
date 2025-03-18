import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import Login from './Login';
import Register from './Register';
import Dashboard from './Dashboard';
import Profile from './Profile';
import AddUserInfo from './AddUserInfo';
import CreatePortfolio from './CreatePortfolio';
import AllPortfolios from './AllPortfolios';
import EditPortfolio from './EditPortfolio';
import SidebarLayout from './SidebarLayout';
import { UserProvider } from './UserContext'; // Import the UserProvider

const PrivateRoute = ({ element: Component, ...rest }) => {
  const token = localStorage.getItem('token');
  return token ? <Component {...rest} /> : <Navigate to="/login" />;
};

function App() {
  return (
    <UserProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<SidebarLayout />}>
              <Route path="/dashboard" element={<PrivateRoute element={Dashboard} />} />
              <Route path="/profile" element={<PrivateRoute element={Profile} />} />
              <Route path="/add-user-info" element={<PrivateRoute element={AddUserInfo} />} />
              <Route path="/create-portfolio" element={<PrivateRoute element={CreatePortfolio} />} />
              <Route path="/all-portfolios" element={<PrivateRoute element={AllPortfolios} />} />
              <Route path="/edit-portfolio/:portfolioId" element={<PrivateRoute element={EditPortfolio} />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;