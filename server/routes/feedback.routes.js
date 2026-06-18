const router = require('express').Router()
const {
    submitFeedback,
    getPublicTestimonials,
    getAllFeedbacks,
    toggleFeedbackVisibility,
    deleteFeedback
} = require('../controllers/feedback.controller')
const { customerProtected, adminProtected } = require('../middlewares/Protected')

// Public routes
router.get('/testimonials', getPublicTestimonials)

// Patient/Customer protected routes
router.post('/submit', customerProtected, submitFeedback)

// Admin protected routes
router.get('/admin/all', adminProtected, getAllFeedbacks)
router.put('/admin/toggle-show/:id', adminProtected, toggleFeedbackVisibility)
router.delete('/admin/delete/:id', adminProtected, deleteFeedback)

module.exports = router
