import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/FrontPage.css'; 
import parkImage from './park1.jpg';

const FrontPage = () => {
    const navigate = useNavigate();
  
    return (
      <div className="frontpage-container">
        <img src={parkImage} alt="Parking System" className="frontpage-image" />
        <h1>Welcome to the Online Parking System</h1>
        <div className="button-group">
          <button onClick={() => navigate('/login')} className="user-btn">
            User
          </button>
          <button onClick={() => navigate('/admin')} className="admin-btn">
            Admin
          </button>
        </div>
      </div>
    );
  };
  

export default FrontPage;
