const asyncHandler = require('express-async-handler')
const Razorpay = require('razorpay')
const crypto = require('crypto')
const Payment = require('../models/payments')
const Booking = require('../models/Booking')

// Razorpay instance in global scope
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_mockkey123',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'mocksecret123'
})

// ─── Create Order (Customer) ───────────────────
exports.createOrder = asyncHandler(async (req, res) => {
    try {

        const { bookingId } = req.body

        // Booking आहे का?
        const booking = await Booking.findById(bookingId)
        if (!booking) {
            return res.status(404).json({ message: "Booking Not Found" })
        }

        // हे booking या customer चं आहे का?
        if (booking.customerId.toString() !== req.user.toString()) {
            return res.status(403).json({ message: "Not Your Booking" })
        }

        // Already paid आहे का?
        if (booking.paymentStatus === 'paid') {
            return res.status(400).json({ message: "Already Paid" })
        }

        // Razorpay order create करतो
        const order = await razorpay.orders.create({
            amount: booking.totalAmount * 100, // paise मध्ये
            currency: 'INR',
            receipt: booking.bookingNumber
        })

        // Payment record create करतो
        await Payment.create({
            bookingId: booking._id,
            customerId: req.user,
            amount: booking.totalAmount,
            method: 'razorpay',
            razorpayOrderId: order.id,
            status: 'initiated'
        })

        res.json({
            message: "Order Created Successfully",
            order: {
                id: order.id,
                amount: order.amount,
                currency: order.currency
            }
        })

    } catch (error) {
        console.log('Error From : createOrder')
        return res.status(500).json({ message: "Internal Server Error" })
    }
})

// ─── Verify Payment (Customer) ─────────────────
exports.verifyPayment = asyncHandler(async (req, res) => {
    try {
        const {
            bookingId,
            razorpayOrderId,
            razorpayPaymentId,
            razorpaySignature
        } = req.body

        // Signature verify करतो
        const body = razorpayOrderId + '|' + razorpayPaymentId
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'mocksecret123')
            .update(body)
            .digest('hex')

        // Signature match होतो का?
        if (expectedSignature !== razorpaySignature) {
            return res.status(400).json({ message: "Invalid Payment Signature" })
        }

        // Payment update करतो
        await Payment.findOneAndUpdate(
            { razorpayOrderId },
            {
                razorpayPaymentId,
                razorpaySignature,
                status: 'success',
                paidAt: new Date()
            }
        )

        // Booking payment status update करतो
        await Booking.findByIdAndUpdate(bookingId, {
            paymentStatus: 'paid'
        })

        res.json({ message: "Payment Verified Successfully" })

    } catch (error) {
        console.log('Error From : verifyPayment')
        return res.status(500).json({ message: "Internal Server Error" })
    }
})

// ─── Cash Payment Confirm (Admin) ─────────────
exports.confirmCashPayment = asyncHandler(async (req, res) => {
    try {
        const { bookingId } = req.params

        const booking = await Booking.findById(bookingId)
        if (!booking) {
            return res.status(404).json({ message: "Booking Not Found" })
        }

        // Cash payment आहे का?
        if (booking.paymentMode !== 'cash') {
            return res.status(400).json({ message: "Not A Cash Booking" })
        }

        // Already paid आहे का?
        if (booking.paymentStatus === 'paid') {
            return res.status(400).json({ message: "Already Paid" })
        }

        // Payment record create करतो
        await Payment.create({
            bookingId: booking._id,
            customerId: booking.customerId,
            amount: booking.totalAmount,
            method: 'cash',
            status: 'success',
            paidAt: new Date()
        })

        // Booking payment status update करतो
        await Booking.findByIdAndUpdate(bookingId, { paymentStatus: 'paid' })
        res.json({ message: "Cash Payment Confirmed Successfully" })
    } catch (error) {
        console.log('Error From : confirmCashPayment')
        return res.status(500).json({ message: "Internal Server Error" })
    }
})

// ─── Get All Payments (Admin) ──────────────────
exports.getAllPayments = asyncHandler(async (req, res) => {
    try {
        const result = await Payment.find()
            .populate('bookingId', 'bookingNumber totalAmount status')
            .populate('customerId', 'name email mobile')
            .sort({ createdAt: -1 })

        res.json({ message: "All Payments Fetched Successfully", result })
    } catch (error) {
        console.log('Error From : getAllPayments')
        return res.status(500).json({ message: "Internal Server Error" })
    }
})

// ─── Get My Payments (Customer) ────────────────
exports.getMyPayments = asyncHandler(async (req, res) => {
    try {
        const result = await Payment.find({ customerId: req.user })
            .populate('bookingId', 'bookingNumber totalAmount status')
            .sort({ createdAt: -1 })

        res.json({ message: "My Payments Fetched Successfully", result })
    } catch (error) {
        console.log('Error From : getMyPayments')
        return res.status(500).json({ message: "Internal Server Error" })
    }
})

// ─── Refund Payment (Admin) ────────────────────
exports.refundPayment = asyncHandler(async (req, res) => {
    try {
        const { bookingId } = req.params

        const booking = await Booking.findById(bookingId)
        if (!booking) {
            return res.status(404).json({ message: "Booking Not Found" })
        }

        // Payment find करतो
        const payment = await Payment.findOne({
            bookingId,
            status: 'success'
        })
        if (!payment) {
            return res.status(404).json({ message: "Payment Not Found" })
        }

        // Already refunded आहे का?
        if (payment.status === 'refunded') {
            return res.status(400).json({ message: "Already Refunded" })
        }

        // Online payment असेल तर Razorpay refund
        if (payment.method === 'razorpay') {
            await razorpay.payments.refund(payment.razorpayPaymentId, {
                amount: payment.amount * 100 // paise मध्ये
            })
        }

        // Payment status update करतो
        await Payment.findByIdAndUpdate(payment._id, {
            status: 'refunded'
        })

        // Booking payment status update करतो
        await Booking.findByIdAndUpdate(bookingId, { paymentStatus: 'refunded' })
        res.json({ message: "Payment Refunded Successfully" })

    } catch (error) {
        console.log('Error From : refundPayment')
        return res.status(500).json({ message: "Internal Server Error" })
    }
})