const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const {
    loginController,
    registerController,
    getAllUsers,
    changePasswordController,
    verifyOtpController // Added OTP verification controller
} = require('../controllers/userController');

// Login route (will send OTP after successful username/password check)
router.post('/login', loginController);

// Register route
router.post('/register', registerController);

// Get all users
router.get('/users', getAllUsers);

// Change password route
router.post('/changepassword', changePasswordController);

// Get user profile by username
router.get('/profile/:username', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update user profile
router.put('/profile/:username', async (req, res) => {
    try {
        const updatedUser = await User.findOneAndUpdate(
            { username: req.params.username },
            { $set: req.body },
            { new: true }
        );
        res.json(updatedUser);
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// New Route: OTP verification
router.post('/verify-otp', verifyOtpController);

module.exports = router;
