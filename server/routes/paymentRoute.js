const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const Payment = require('../models/paymentModel');
const User = require('../models/userModel'); // Import user model

// Route to handle payment
router.post('/payment', async (req, res) => {
    const { username, slotIndex, amount, paymentMethod, pin, checkinDateTime, checkoutDateTime } = req.body;

    try {
        // Find the user by username
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ message: 'User not found!' });
        }

        // Compare the entered PIN with the hashed PIN in the database
        const isPinValid = await bcrypt.compare(pin, user.pin);
        
        if (!isPinValid) {
            return res.status(401).json({ message: 'Invalid PIN. Payment failed.' });
        }

        // Proceed with saving the payment if PIN matches
        const newPayment = new Payment({
            username,
            slotIndex,
            amount,
            paymentMethod,
            pin: user.pin, // Store hashed pin
            checkinDateTime,
            checkoutDateTime,
        });

        await newPayment.save();
        res.status(200).json({ message: 'Payment successful', payment: newPayment });
    } catch (error) {
        console.error('Error processing payment:', error);
        res.status(500).json({ message: 'Payment failed', error });
    }
});

module.exports = router;
