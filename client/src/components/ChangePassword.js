import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/ChangePassword.css';

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    username: '',
    oldPassword: '',
    newPassword: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:9090/api/v1/changepassword', formData);
      if (response.status === 200) {
        alert('Password changed successfully');
        navigate('/');
      }
    } catch (error) {
      if (error.response && error.response.data) {
        console.error('Error response:', error.response.data); // Log the response for debugging
        alert(error.response.data.message || 'Password change failed');
      } else {
        console.error('Error:', error); // Log the error for debugging
        alert('An error occurred. Please try again later.');
      }
    }
  };

  const handleClear = () => {
    setFormData({
      username: '',
      oldPassword: '',
      newPassword: ''
    });
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="change-password-container">
      <div className="change-password-left">
        <h2>Change Password</h2>
      </div>
      <div className="change-password-right">
        <form onSubmit={handleSubmit}>
          <label>User Name</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
          <label>Old Password</label>
          <input
            type="password"
            name="oldPassword"
            value={formData.oldPassword}
            onChange={handleChange}
          />
          <label>New Password</label>
          <input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
          />
          <div className="form-actions">
            <button type="submit">Change</button>
            <button type="button" onClick={handleBack}>Back</button>
            <button type="button" onClick={handleClear}>Clear</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
