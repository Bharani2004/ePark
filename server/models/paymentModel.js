const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    username: { type: String, required: true },
    slotIndex: { type: Number, required: true },
    amount: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    pin: { type: String, required: true }, // You can encrypt this in a real-world app
    checkinDateTime: { type: Date, required: true },
    checkoutDateTime: { type: Date, required: true },
}, {
    timestamps: true
});

const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;
