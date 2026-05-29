const {
    createOrder,
    verifyPayment,
    confirmCashPayment,
    getAllPayments,
    getMyPayments,
    refundPayment
} = require('../controllers/payment.controller')
const { customerProtected, adminProtected } = require('../middlewares/Protected')
const router = require('express').Router()


// ─── Customer Routes ───────────────────────────
router
    .post('/create-order', customerProtected, createOrder)
    .post('/verify-payment', customerProtected, verifyPayment)
    .get('/get-my-payment', customerProtected, getMyPayments)

    // ─── Admin Routes ──────────────────────────────
    .get('/all-payments', adminProtected, getAllPayments)
    .put('/cash-confirm/:bookingId', adminProtected, confirmCashPayment)
    .put('/refund-payment/:bookingId', adminProtected, refundPayment)

module.exports = router