const mongoose = require("mongoose")


const paymentSchema = new mongoose.Schema({
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Auth', required: true },
    amount: { type: Number, reuired: true },
    method: { type: String, enum: ['razorpay', 'cash'], required: true },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
    status: { type: String, enum: ['initiated', 'success', 'failed', 'refunded'], default: 'initiated' },
    paidAt: { type: Date, default: null }
}, { timestamps: true })


module.exports = mongoose.model('Payment', paymentSchema)