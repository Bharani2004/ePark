const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    username: { type: String, required: true },
    slotIndex: { type: Number, required: true },
    checkinDate: { type: Date, required: true },
    checkoutDate: { type: Date, required: true },
    checkinTime: { type: String, required: true },
    checkoutTime: { type: String, required: true }
});

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
