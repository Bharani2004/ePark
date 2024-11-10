// src/components/AdminDashboard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import adminImg from './park.png'; // Use an appropriate image for the admin dashboard
import '../css/AdminDashboard.css'; 

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleViewStatistics = () => {
    navigate('/statistics'); // Navigate to statistics page
  };

  const handleViewBookings = () => {
    navigate('/admin-booked-slots'); // Navigate to bookings page
  };

  const handleLogout = () => {
    localStorage.removeItem('username'); // Clear localStorage on logout
    localStorage.removeItem('token'); // Also clear token
    navigate('/admin'); // Redirect to admin login page
  };

  return (
    <div className="admin-dashboard-container">
      <div className="sidebar">
        <button className="sidebar-btn" onClick={handleViewStatistics}>View Statistics</button>
        <button className="sidebar-btn" onClick={handleViewBookings}>View Bookings</button>
        <button className="sidebar-btn" onClick={handleLogout}>Sign Out</button>
      </div>
      <div className="main-content">
        <h1>Admin Dashboard</h1>
        <img src={adminImg} alt="Admin Dashboard" className="admin-img" />
        <p>Welcome, Admin!</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
