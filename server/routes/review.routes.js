const {
    createReview,
    getNurseReviews,
    getMyReviews,
    getAllReviews
} = require('../controllers/review.controller')
const { customerProtected } = require('../middlewares/Protected')
const router = require('express').Router()

// ─── Customer Routes ───────────────────────────
router
    .post('/create-review', customerProtected, createReview)
    .get('/my-reviews', customerProtected, getMyReviews)

    // ─── Common Routes ─────────────────────────────
    .get('/get-nurse-review/:nurseId', getNurseReviews)

    // ─── Admin Routes ──────────────────────────────
    .get('/get-all-reviews', customerProtected, getAllReviews)

module.exports = router