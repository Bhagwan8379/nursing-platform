const Feedback = require('../models/Feedback')
const Auth = require('../models/Auth')
const asyncHandler = require('express-async-handler')

// @desc    Submit platform feedback (Patient only)
// @route   POST /api/feedback/submit
// @access  Private (Patient)
exports.submitFeedback = asyncHandler(async (req, res) => {
    const { rating, comment } = req.body

    if (!rating || !comment) {
        return res.status(400).json({ message: 'Rating and comment are required' })
    }

    // Fetch user details to get real name and email
    const patient = await Auth.findById(req.user)
    if (!patient) {
        return res.status(404).json({ message: 'Patient account not found' })
    }

    const newFeedback = await Feedback.create({
        patientId: req.user,
        name: patient.name,
        email: patient.email,
        rating: Number(rating),
        comment: comment.trim()
    })

    res.status(201).json({
        message: 'Feedback submitted successfully',
        result: {
            _id: newFeedback._id,
            name: newFeedback.name,
            rating: newFeedback.rating,
            comment: newFeedback.comment
        }
    })
})

// @desc    Get approved testimonials (Public)
// @route   GET /api/feedback/testimonials
// @access  Public
exports.getPublicTestimonials = asyncHandler(async (req, res) => {
    const testimonials = await Feedback.find({ showInTestimonials: true })
        .select('name rating comment')
        .sort({ createdAt: -1 })

    res.status(200).json({
        message: 'Public testimonials fetched successfully',
        result: testimonials
    })
})

// @desc    Get all feedbacks (Admin only)
// @route   GET /api/feedback/admin/all
// @access  Private (Admin)
exports.getAllFeedbacks = asyncHandler(async (req, res) => {
    const feedbacks = await Feedback.find()
        .select('name email rating comment showInTestimonials createdAt')
        .sort({ createdAt: -1 })

    res.status(200).json({
        message: 'All feedbacks fetched successfully',
        result: feedbacks
    })
})

// @desc    Toggle feedback visibility in testimonials (Admin only)
// @route   PUT /api/feedback/admin/toggle-show/:id
// @access  Private (Admin)
exports.toggleFeedbackVisibility = asyncHandler(async (req, res) => {
    const feedback = await Feedback.findById(req.params.id)

    if (!feedback) {
        return res.status(404).json({ message: 'Feedback record not found' })
    }

    feedback.showInTestimonials = !feedback.showInTestimonials
    await feedback.save()

    res.status(200).json({
        message: `Feedback visibility toggled successfully. Now ${feedback.showInTestimonials ? 'visible' : 'hidden'}.`,
        result: {
            _id: feedback._id,
            showInTestimonials: feedback.showInTestimonials
        }
    })
})

// @desc    Delete feedback record (Admin only)
// @route   DELETE /api/feedback/admin/delete/:id
// @access  Private (Admin)
exports.deleteFeedback = asyncHandler(async (req, res) => {
    const feedback = await Feedback.findByIdAndDelete(req.params.id)

    if (!feedback) {
        return res.status(404).json({ message: 'Feedback record not found' })
    }

    res.status(200).json({
        message: 'Feedback record deleted successfully'
    })
})
