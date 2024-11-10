// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import ChangePassword from './components/ChangePassword';
import Dashboard from './components/Dashboard';
import UpdateProfile from './components/UpdateProfile';
import BookSlots from './components/BookSlots';
import Payment from './components/payment'; 
import Statistics from './components/Statistics';
import FrontPage from './components/FrontPage';
import Admin from './components/Admin';
import AdminDashboard from './components/AdminDashboard';
import ViewBookings from './components/ViewBooking';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<FrontPage />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/changepassword" element={<ChangePassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/update-profile/:username" element={<UpdateProfile />} />
          <Route path="/book-slots" element={<BookSlots />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin-booked-slots" element={<ViewBookings />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
