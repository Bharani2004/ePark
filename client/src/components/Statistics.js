import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js'; // Import necessary Chart.js components
import '../css/Statistics.css';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Statistics = () => {
    const [statistics, setStatistics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStatistics = async () => {
            try {
                const response = await fetch('http://localhost:9090/api/v1/parking/statistics');
                if (!response.ok) {
                    throw new Error('Failed to fetch statistics');
                }
                const data = await response.json();
                setStatistics(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchStatistics();
    }, []);

    if (loading) return <p>Loading statistics...</p>;
    if (error) return <p>Error: {error}</p>;

    // Data for the chart
    const chartData = {
        labels: ['Total Bookings', 'Total Users', 'Booked Slots', 'Available Slots'],
        datasets: [
            {
                label: 'Parking Statistics',
                data: [
                    statistics.totalBookings,
                    statistics.totalUsers,
                    statistics.bookedSlots,
                    statistics.availableSlots,
                ],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(255, 206, 86, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    // Options for clustering
    const options = {
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    // Button click handler for booking a slot
    const handleBookSlot = () => {
        navigate('/admin-dashboard');
    };

    return (
        <div className="statistics-container">
            <div className="chart-container">
                <h2>Parking Statistics</h2>
                <Bar data={chartData} options={options} />
                <button className="book-slot-button" onClick={handleBookSlot}>
                    Go To Dashboard
                </button>
            </div>
            <div className="empty-space"></div> 
        </div>
    );
};

export default Statistics;
