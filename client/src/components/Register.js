import React, { useState } from 'react';
import axios from 'axios';
import '../css/Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    gender: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
    mobile: '',
    pin: '' // Added PIN field here
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Basic validation
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword || !formData.address || !formData.mobile || !formData.pin) {
      alert('Please fill in all fields!');
      return;
    }
  
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
  
    if (formData.password.length < 6) {
      alert('Password must be at least 6 characters long!');
      return;
    }
  
    try {
      const response = await axios.post('http://localhost:9090/api/v1/register', formData);
      console.log('User registered successfully:', response.data);
      alert('Registration successful!');
      handleClear(); // Clear the form after successful submission
    } catch (error) {
      // Improved error logging
      if (error.response) {
        console.error('Error during registration:', error.response.data); // Log error data from response
        alert(`Registration failed: ${error.response.data.message || error.response.data}`);
      } else {
        console.error('Error during registration:', error.message);
        alert('Registration failed: Please try again later.');
      }
    }
  };
  

  const handleClear = () => {
    setFormData({
      username: '',
      gender: '',
      email: '',
      password: '',
      confirmPassword: '',
      address: '',
      mobile: '',
      pin: '' // Clear PIN field as well
    });
  };

  return (
    <div className="register-container">
      <h2>New User Register</h2>
      <form onSubmit={handleSubmit}>
        <label>Username</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Enter your username"
        />

        <label>Gender</label>
        <select name="gender" value={formData.gender} onChange={handleChange}>
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
        />

        <label>Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
        />

        <label>Confirm Password</label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm your password"
        />

        <label>Address</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Enter your address"
        />

        <label>Mobile No</label>
        <input
          type="text"
          name="mobile"
          value={formData.mobile}
          onChange={handleChange}
          placeholder="Enter your mobile number"
        />

        <label>PIN</label> {/* Added PIN field here */}
        <input
          type="text"
          name="pin"
          value={formData.pin}
          onChange={handleChange}
          placeholder="Enter your PIN"
        />

        <div className="form-buttons">
          <button type="button" onClick={handleClear}>
            Clear
          </button>
          <button type="submit">Submit</button>
          <button type="button" onClick={() => window.history.back()}>
            Back
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;
