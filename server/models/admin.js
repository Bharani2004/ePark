
const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Name is required'],
        unique: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    mobile: {
        type: String,
        required: [true, 'Mobile Number is required'],
    },
});

// Export the model
module.exports = mongoose.model('Admin', adminSchema);
