import React from 'react';
import { useNavigate } from 'react-router-dom';
import loginImg from './park.png';
import '../css/Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  
  const username = localStorage.getItem('username'); // Assuming you store username in localStorage
  
  const handleProfileClick = () => {
    navigate(`/update-profile/${username}`); // Navigate to the update profile page with the username
  };

  const handleLogout = () => {
    localStorage.removeItem('username'); // Clear localStorage on logout
    navigate('/'); // Redirect to login page
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <button className="sidebar-btn" onClick={handleProfileClick}>Profile</button>
        <button className="sidebar-btn" onClick={() => navigate('/book-slots')}>Book Slots</button>
        <button className="sidebar-btn" onClick={handleLogout}>Sign Out</button>
      </div>
      <div className="main-content">
        <h1>Online Parking System</h1>
        <img src={loginImg} alt="Parking System" className="parking-img" />
      </div>
    </div>
  );
};

export default Dashboard;
