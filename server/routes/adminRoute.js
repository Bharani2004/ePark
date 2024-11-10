// routes/adminRoute.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Admin = require('../models/admin'); // Adjust the path as necessary
const Booking = require('../models/bookingModel'); // Model for bookings, adjust as needed

const router = express.Router();

// Register Admin
router.post('/register', async (req, res) => {
    const { username, email, password, mobile } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newAdmin = new Admin({
            username,
            email,
            password: hashedPassword,
            mobile,
        });
        await newAdmin.save();
        res.status(201).json({ message: 'Admin registered successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Login Admin
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const admin = await Admin.findOne({ username });
        if (!admin) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        
        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token, message: 'Login successful' });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred. Please try again later.' });
    }
});

// Get All Booked Slots for Admin
router.get('/booked-slots', async (req, res) => {
    try {
        const bookedSlots = await Booking.find({}); // Fetch all bookings
        res.json({ bookedSlots });
    } catch (error) {
        console.error('Error fetching booked slots:', error);
        res.status(500).json({ message: 'Error fetching booked slots' });
    }
});

// Delete a Booking by Slot Index
router.delete('/booked-slots/:slotIndex', async (req, res) => {
    const { slotIndex } = req.params;

    try {
        const result = await Booking.deleteOne({ slotIndex: slotIndex }); // Adjust this according to your schema
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        res.status(200).json({ message: 'Booking deleted successfully' });
    } catch (error) {
        console.error('Error deleting booking:', error);
        res.status(500).json({ message: 'Error deleting booking' });
    }
});

module.exports = router;
