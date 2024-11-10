// src/components/ViewBooking.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import '../css/ViewBooking.css';

const ViewBooking = () => {
    const [bookedSlots, setBookedSlots] = useState([]);
    const navigate = useNavigate(); // Initialize useNavigate

    // Fetch all booked slots when the component loads
    useEffect(() => {
        const fetchBookedSlots = async () => {
            try {
                const response = await fetch('http://localhost:9090/api/v1/admin/booked-slots', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }); 
                if (response.ok) {
                    const { bookedSlots } = await response.json();
                    setBookedSlots(bookedSlots); // Store booked slots data
                } else {
                    console.error("Error fetching booked slots:", response.statusText);
                }
            } catch (error) {
                console.error('Error fetching booked slots:', error);
            }
        };
        fetchBookedSlots();
    }, []);

    // Function to delete a booking
    const handleDelete = async (slotIndex) => {
        if (window.confirm('Are you sure you want to delete this booking?')) {
            try {
                const response = await fetch(`http://localhost:9090/api/v1/admin/booked-slots/${slotIndex}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                if (response.ok) {
                    setBookedSlots(bookedSlots.filter(booking => booking.slotIndex !== slotIndex));
                } else {
                    console.error("Error deleting booking:", response.statusText);
                }
            } catch (error) {
                console.error('Error deleting booking:', error);
            }
        }
    };

    // Function to navigate to the dashboard
    const handleGoToDashboard = () => {
        navigate('/admin-dashboard'); // Change '/dashboard' to the correct path of your dashboard
    };

    return (
        <div className="admin-bookings-container">
            <h2>View Bookings</h2>
            {bookedSlots.length === 0 ? (
                <p>No bookings available.</p>
            ) : (
                <table className="bookings-table">
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Slot Index</th>
                            <th>Check-in Date</th>
                            <th>Check-out Date</th>
                            <th>Check-in Time</th>
                            <th>Check-out Time</th>
                            <th>Action</th> {/* New column for delete action */}
                        </tr>
                    </thead>
                    <tbody>
                        {bookedSlots.map((booking, index) => (
                            <tr key={index}>
                                <td>{booking.username}</td>
                                <td>{booking.slotIndex}</td>
                                <td>{new Date(booking.checkinDate).toLocaleDateString()}</td>
                                <td>{new Date(booking.checkoutDate).toLocaleDateString()}</td>
                                <td>{booking.checkinTime}</td>
                                <td>{booking.checkoutTime}</td>
                                <td>
                                    <button className="delete-button" onClick={() => handleDelete(booking.slotIndex)}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            <button className="dashboard-button" onClick={handleGoToDashboard}>
                Go To Dashboard
            </button> 
        </div>
    );
};

export default ViewBooking;
