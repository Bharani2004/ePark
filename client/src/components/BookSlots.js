import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import emptyImg from './empty.png';
import parkedImg from './parked.png';
import bookedImg from './book.png';
import '../css/BookSlots.css';

const BookSlots = () => {
    const username = localStorage.getItem('username');  
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [checkinDate, setCheckinDate] = useState('');
    const [checkoutDate, setCheckoutDate] = useState('');
    const [checkinTime, setCheckinTime] = useState('');
    const [checkoutTime, setCheckoutTime] = useState('');
    const [bookedSlots, setBookedSlots] = useState([]); 
    const [clusteredSlots, setClusteredSlots] = useState([]); 
    const navigate = useNavigate();

    // Fetch booked slots
    useEffect(() => {
        const fetchBookedSlots = async () => {
            try {
                const response = await fetch('http://localhost:9090/api/v1/parking/booked-slots');
                if (response.ok) {
                    const { bookedSlots } = await response.json();
                    setBookedSlots(bookedSlots);  
                    applyClustering(bookedSlots); 
                } else {
                    console.error("Error fetching booked slots:", response.statusText);
                }
            } catch (error) {
                console.error('Error fetching booked slots:', error);
            }
        };
        fetchBookedSlots();
    }, []);

    // Fetch current user's bookings
    useEffect(() => {
        const fetchBookingData = async () => {
            if (!username) return;

            try {
                const response = await fetch(`http://localhost:9090/api/v1/parking/bookings/${username}`);
                if (response.ok) {
                    const booking = await response.json();
                    if (booking && booking.length > 0) {
                        const latestBooking = booking[0];
                        setSelectedSlot(latestBooking.slotIndex - 1); 
                        setCheckinDate(new Date(latestBooking.checkinDate).toISOString().split('T')[0]);
                        setCheckoutDate(new Date(latestBooking.checkoutDate).toISOString().split('T')[0]);
                        setCheckinTime(latestBooking.checkinTime);
                        setCheckoutTime(latestBooking.checkoutTime);
                    }
                } else {
                    console.error("Error fetching user booking:", response.statusText);
                }
            } catch (error) {
                console.error('Error fetching user booking:', error);
            }
        };
        fetchBookingData();
    }, [username]);

    // Check if a slot is booked
    const isSlotBooked = (slotIndex) => {
        return bookedSlots.some(slot => slot === (slotIndex + 1)); 
    };

    // Handle slot click (selection)
    const handleSlotClick = (slotIndex) => {
        if (isSlotBooked(slotIndex)) {
            alert('This slot is already booked by another user.');
            return;
        }
        setSelectedSlot(slotIndex);
    };

    // Navigate to payment page with selected slot details
    const handleProceedToPayment = async () => {
        if (
            selectedSlot === null ||
            !username ||
            !checkinDate.trim() ||
            !checkoutDate.trim() ||
            !checkinTime.trim() ||
            !checkoutTime.trim()
        ) {
            alert('Please fill in all fields.');
            return;
        }

        const formatTime = (time) => {
            const date = new Date(`1970-01-01T${time}`); // Parse the time in local time zone
            return date.toTimeString().slice(0, 5); // Format it to HH:mm (local time)
        };
    
        const formattedCheckinTime = formatTime(checkinTime);
        const formattedCheckoutTime = formatTime(checkoutTime);
    
        // Create proper DateTime strings
        const checkinDateTime = new Date(`${checkinDate}T${formattedCheckinTime}`);
        const checkoutDateTime = new Date(`${checkoutDate}T${formattedCheckoutTime}`);

        // Check if the dates are valid
        if (isNaN(checkinDateTime.getTime()) || isNaN(checkoutDateTime.getTime())) {
            alert('Invalid date or time format. Please check your entries.');
            return;
        }

        // Pass booking data to the payment page
        navigate('/payment', {
            state: {
                username,
                checkinDateTime: checkinDateTime.toISOString(),
                checkoutDateTime: checkoutDateTime.toISOString(),
                slotIndex: selectedSlot + 1,  // Passing the slot index (1-based)
            }
        });
    };

    // Function to apply K-Means clustering to booked slots
    const applyClustering = (bookedSlots) => {
        const clusters = {};

        bookedSlots.forEach((slot) => {
            const clusterKey = Math.floor((slot - 1) / 5); // Create clusters of 5 slots each
            if (!clusters[clusterKey]) {
                clusters[clusterKey] = [];
            }
            clusters[clusterKey].push(slot);
        });

        setClusteredSlots(Object.values(clusters)); // Store the clustered slots
    };

    return (
        <div className="booking-slots-container">
            <h2>Select a Parking Slot</h2>
            <div className="slots-grid">
                {Array.from({ length: 15 }).map((_, index) => {
                    const booked = isSlotBooked(index);
                    return (
                        <div
                            key={index}
                            className={`slot ${selectedSlot === index ? 'selected' : ''} ${booked ? 'booked' : ''}`}
                            onClick={() => handleSlotClick(index)}
                        >
                            <img
                                src={booked ? bookedImg : selectedSlot === index ? parkedImg : emptyImg}
                                alt={booked ? 'Booked Slot' : selectedSlot === index ? 'Parked Slot' : 'Empty Slot'}
                                className="car-img"
                            />
                        </div>
                    );
                })}
            </div>
            {/* Display clustered slots if applicable */}
            <div className="clusters">
                <h3>Parked Slots</h3>
                {clusteredSlots.map((slots, clusterIndex) => (
                    <div key={clusterIndex} className="cluster">
                        <h4>Parking Slot {clusterIndex + 1}</h4>
                        <div className="cluster-slots">
                            {slots.map(slot => (
                                <span key={slot} className="cluster-slot">{"Slot Number " + slot}</span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <div className="booking-details">
                <h3>Booking Details</h3>
                <label>
                    Check-in Date:
                    <input
                        type="date"
                        value={checkinDate}
                        onChange={(e) => setCheckinDate(e.target.value)}
                    />
                </label>
                <label>
                    Check-out Date:
                    <input
                        type="date"
                        value={checkoutDate}
                        onChange={(e) => setCheckoutDate(e.target.value)}
                    />
                </label>
                <label>
                    Check-in Time:
                    <input
                        type="time"
                        value={checkinTime}
                        onChange={(e) => setCheckinTime(e.target.value)}
                    />
                </label>
                <label>
                    Check-out Time:
                    <input
                        type="time"
                        value={checkoutTime}
                        onChange={(e) => setCheckoutTime(e.target.value)}
                    />
                </label>
                <button onClick={handleProceedToPayment}>Proceed to Payment</button>
            </div>
        </div>
    );
};

export default BookSlots;
