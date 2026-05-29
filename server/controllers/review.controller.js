const asyncHandler = require('express-async-handler')
const Review = require('../models/Reviews')
const Booking = require('../models/Booking')
const NurseProfile = require('../models/NurseProfile')

// ─── Create Review (Customer) ──────────────────
exports.createReview = asyncHandler(async (req, res) => {
    try {
        const { bookingId, rating, comment } = req.body

        // Booking आहे का?
        const booking = await Booking.findById(bookingId)
        if (!booking) {
            return res.status(404).json({ message: "Booking Not Found" })
        }

        // हे booking या customer चं आहे का?
        if (booking.customerId.toString() !== req.user.toString()) {
            return res.status(403).json({ message: "Not Your Booking" })
        }

        // Booking complete आहे का?
        if (booking.status !== 'complete') {
            return res.status(400).json({ message: "Service Not Completed Yet" })
        }

        // Already review दिला का?
        const alreadyReviewed = await Review.findOne({ bookingId })
        if (alreadyReviewed) {
            return res.status(400).json({ message: "Already Reviewed" })
        }

        // Review create करतो
        await Review.create({
            bookingId,
            customerId: req.user,
            nurseId: booking.assignedNurseId,
            rating,
            comment
        })

        // Nurse चं average rating update करतो
        const allReviews = await Review.find({ nurseId: booking.assignedNurseId })
        const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length

        await NurseProfile.findOneAndUpdate(
            { nurseId: booking.assignedNurseId },
            { ratingAverage: avgRating.toFixed(1) }
        )
        res.status(201).json({ message: "Review Created Successfully" })

    } catch (error) {
        console.log('Error From : createReview')
        return res.status(500).json({ message: "Internal Server Error" })
    }
})

// ─── Get Nurse Reviews ─────────────────────────
exports.getNurseReviews = asyncHandler(async (req, res) => {
    try {
        const { nurseId } = req.params

        const result = await Review.find({ nurseId })
            .populate('customerId', 'name profilePhoto')
            .populate('bookingId', 'bookingNumber')
            .sort({ createdAt: -1 })

        res.json({ message: "Nurse Reviews Fetched Successfully", result })
    } catch (error) {
        console.log('Error From : getNurseReviews')
        return res.status(500).json({ message: "Internal Server Error" })
    }
})

// ─── Get My Reviews (Customer) ─────────────────
exports.getMyReviews = asyncHandler(async (req, res) => {
    try {
        const result = await Review.find({ customerId: req.user })
            .populate('nurseId', 'name profilePhoto')
            .populate('bookingId', 'bookingNumber')
            .sort({ createdAt: -1 })

        res.json({ message: "My Reviews Fetched Successfully", result })
    } catch (error) {
        console.log('Error From : getMyReviews')
        return res.status(500).json({ message: "Internal Server Error" })
    }
})

// ─── Get All Reviews (Admin) ───────────────────
exports.getAllReviews = asyncHandler(async (req, res) => {
    try {
        const result = await Review.find()
            .populate('customerId', 'name email')
            .populate('nurseId', 'name email')
            .populate('bookingId', 'bookingNumber')
            .sort({ createdAt: -1 })

        res.json({ message: "All Reviews Fetched Successfully", result })
    } catch (error) {
        console.log('Error From : getAllReviews')
        return res.status(500).json({ message: "Internal Server Error" })
    }
})