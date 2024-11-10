import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/Admin.css'; // Ensure you have the appropriate styles

const Admin = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    mobile: '',
  });
  const [isLogin, setIsLogin] = useState(true); 
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isLogin
      ? 'http://localhost:9090/api/v1/admin/login'
      : 'http://localhost:9090/api/v1/admin/register';
    
    try {
      const response = await axios.post(url, formData);
      alert(response.data.message);

      // Only redirect on successful login, not registration
      if (isLogin) {
        navigate('/admin-dashboard'); // Redirect to admin dashboard on successful login
      } else {
        // Optionally handle post-registration logic
        // For example, redirect to a login page after successful registration
        setIsLogin(true);
      }
    } catch (error) {
      alert(error.response?.data?.message || 'An error occurred. Please try again later.');
    }
  };
  const handleLogout = () => {
    navigate('/'); // Redirect to home or main menu
  };

  // const toggleForm = () => {
  //   setIsLogin(!isLogin);
  //   setFormData({
  //     username: '',
  //     email: '',
  //     password: '',
  //     mobile: '',
  //   });
  // };

  return (
    <div className="admin-container">
      <h2>{isLogin ? 'Admin Login' : 'Register Admin'}</h2>
      <form onSubmit={handleSubmit}>
        <label>Username</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        {!isLogin && (
          <>
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <label>Mobile</label>
            <input
              type="text"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              required
            />
          </>
        )}
        <label>Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit" className="admin-btn1">
          {isLogin ? 'Login' : 'Register'}
        </button>
      </form>
      {/* <div className="toggle-link">
        <p>
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <span onClick={toggleForm}>{isLogin ? <strong>Register</strong> : <strong>Login</strong>}</span>
        </p>
      </div> */}
      {/* Show logout button only if the user is logged in */}
      {isLogin && (
        <button onClick={handleLogout} className="admin-btn2">
          Logout
        </button>
      )}
    </div>
  );
};

export default Admin;
