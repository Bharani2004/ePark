const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: [true, 'Name is required'], unique:true },
    gender: { type: String, required: [true, 'Gender is required'] },
    email: { type: String, required: [true, 'Email is required'], unique: true },
    password: { type: String, required: [true, 'Password is required'] },
    address: { type: String, required: [true, 'Address is required'] },
    mobile: { type: String, required: [true, 'Mobile Number is required'] },
    pin: { type: String, required: [true, 'PIN is required'] } // New pin field
});

// Hash the pin before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('pin')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.pin = await bcrypt.hash(this.pin, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Export
const userModel = mongoose.model('user', userSchema);
module.exports = userModel;
