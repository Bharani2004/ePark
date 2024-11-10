const express = require('express');
const router = express.Router();
const Booking = require('../models/bookingModel');

// Route to book a slot
router.post('/book', async (req, res) => {
    const { username, slotIndex, checkinDate, checkoutDate, checkinTime, checkoutTime } = req.body;

    // Validate required fields
    if (!username || slotIndex === undefined || !checkinDate || !checkoutDate || !checkinTime || !checkoutTime) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Check if the slot is booked by another user for the same time range
        const slotConflict = await Booking.findOne({
            slotIndex,
            $or: [
                {
                    checkinDate: { $lt: checkoutDate },
                    checkoutDate: { $gt: checkinDate },
                    checkinTime: { $lt: checkoutTime },
                    checkoutTime: { $gt: checkinTime }
                }
            ]
        });

        if (slotConflict) {
            return res.status(400).json({ message: 'Slot is already booked for the selected time period.' });
        }

        // Create a new booking if no conflicts
        const newBooking = new Booking({
            username,
            slotIndex,
            checkinDate,
            checkoutDate,
            checkinTime,
            checkoutTime
        });

        // Save the new booking
        await newBooking.save();

        return res.status(201).json({ message: `Slot ${slotIndex} booked successfully by ${username}.` });
    } catch (error) {
        console.error('Error booking slot:', error);
        res.status(500).json({ message: 'Server error occurred while booking the slot.' });
    }
});

// Route to fetch user's booking data
router.get('/bookings/:username', async (req, res) => {
    const { username } = req.params;

    try {
        const bookings = await Booking.find({ username });
        if (!bookings || bookings.length === 0) {
            return res.status(404).json({ message: 'No bookings found for the user.' });
        }
        res.status(200).json(bookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ message: 'Server error occurred while fetching the bookings.' });
    }
});

// Route to get all booked slots
router.get('/booked-slots', async (req, res) => {
    try {
        // Fetch all bookings and return the slotIndex of booked slots
        const bookedSlots = await Booking.find().select('slotIndex -_id');
        const bookedSlotIndexes = bookedSlots.map(booking => booking.slotIndex);
        
        res.status(200).json({ bookedSlots: bookedSlotIndexes });
    } catch (error) {
        console.error('Error fetching booked slots:', error);
        res.status(500).json({ message: 'Server error occurred while fetching booked slots.' });
    }
});

// Route to fetch statistics
router.get('/statistics', async (req, res) => {
    try {
        const totalBookings = await Booking.countDocuments();
        const distinctUsers = await Booking.distinct('username'); // Get distinct usernames
        const totalUsers = distinctUsers.length; // Count the number of distinct usernames
        const bookedSlots = await Booking.distinct('slotIndex');
        const totalSlots = 15; // Assuming a total of 15 parking slots

        res.status(200).json({
            totalBookings,
            totalUsers,
            bookedSlots: bookedSlots.length,
            totalSlots,
            availableSlots: totalSlots - bookedSlots.length,
        });
    } catch (error) {
        console.error('Error fetching statistics:', error);
        res.status(500).json({ message: 'Server error occurred while fetching statistics.' });
    }
});

module.exports = router;
