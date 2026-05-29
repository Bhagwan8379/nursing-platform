const {
    createBooking,
    getMyBookings,
    getNurseBookings,
    getSingleBooking,
    acceptBooking,
    declineBooking,
    updateBookingStatus,
    cancelBooking,
} = require('../controllers/booking.controller')
const { customerProtected, nurseProtected } = require('../middlewares/Protected')

const router = require('express').Router()


// ─── Customer Routes ───────────────────────────
router


    .post('/create-booking', customerProtected, createBooking)
    .get('/get-my-bookings', customerProtected, getMyBookings)
    .put('/cancel/:bookingId', customerProtected, cancelBooking)

    // ─── Nurse Routes ──────────────────────────────
    .get('/get-nurse-bookings', nurseProtected, getNurseBookings)
    .put('/accept-booking/:bookingId', nurseProtected, acceptBooking)
    .put('/decline-booking/:bookingId', nurseProtected, declineBooking)
    .put('/update-status/:bookingId', nurseProtected, updateBookingStatus)

    // ─── Common Routes ─────────────────────────────
    .get('/get-single-booking/:bookingId', getSingleBooking)

module.exports = router