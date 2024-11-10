const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const crypto = require('crypto'); // For generating OTP
const nodemailer = require('nodemailer');

const otpStore = {};

// Configure Nodemailer for sending emails
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS, 
    },
});

const loginController = async (req, res) => {
    try {
        const { username, password } = req.body;

        console.log('Received login request for username:', username);

        // Find the user in the database
        const user = await User.findOne({ username });
        if (!user) {
            console.log('User not found:', username);
            return res.status(400).json({ message: 'User not found' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Invalid password for user:', username);
            return res.status(400).json({ message: 'Invalid password' });
        }

        // Generate OTP
        const otp = crypto.randomInt(100000, 999999);
        otpStore[username] = otp;

        // Set up email options
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Your OTP for Login',
            text: `Your OTP is: ${otp}. Please use this to complete your login process.`,
        };

        // Send email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending OTP:', error); // Log error for debugging
                return res.status(500).json({ message: 'Failed to send OTP', error: error.message });
            }
            console.log('OTP sent to:', user.email);
            res.status(200).json({ message: 'OTP sent to your email' });
        });
    } catch (err) {
        console.error('Login error:', err); // Log the complete error
        res.status(500).json({ message: 'An error occurred during login', error: err.message });
    }
};



// OTP Verification Controller
const verifyOtpController = (req, res) => {
    const { username, otp } = req.body;

    // Check if the OTP is valid
    if (otpStore[username] && otpStore[username] === parseInt(otp)) {
        delete otpStore[username]; // Remove OTP after verification
        res.status(200).json({ message: 'OTP verified, login successful' });
    } else {
        res.status(400).json({ message: 'Invalid OTP' });
    }
};


// Register Controller remains unchanged
const registerController = async (req, res) => {
    try {
        const { username, password, pin, ...otherDetails } = req.body;
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            password: hashedPassword,
            pin, // Add PIN to user data
            ...otherDetails
        });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully!' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Fetch All Users remains unchanged
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: 'An error occurred' });
    }
};

// Change Password Controller remains unchanged
const changePasswordController = async (req, res) => {
    try {
        const { username, oldPassword, newPassword } = req.body;

        // Find user by username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Check old password
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Old password is incorrect' });
        }

        // Hash new password and save
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedNewPassword;
        await user.save();

        res.status(200).json({ message: 'Password changed successfully!' });
    } catch (err) {
        console.error('Server error during password change:', err.message);
        res.status(500).json({ message: 'An error occurred' });
    }
};

// Get User Profile remains unchanged
const getUserProfile = async (username) => {
    try {
        const user = await User.findOne({ username });
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    } catch (err) {
        throw new Error(err.message);
    }
};

// Update User Profile remains unchanged
const updateUserProfile = async (username, updateData) => {
    try {
        const user = await User.findOneAndUpdate({ username }, updateData, { new: true });
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    } catch (err) {
        throw new Error(err.message);
    }
};

module.exports = {
    loginController,
    registerController,
    getAllUsers,
    changePasswordController,
    getUserProfile,
    updateUserProfile,
    verifyOtpController
};
