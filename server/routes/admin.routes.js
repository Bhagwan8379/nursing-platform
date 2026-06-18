
const {
    getAllNurses,
    getPendingNurses,
    approveNurse,
    rejectNurse,
    suspendNurse
} = require('../controllers/nurse.controller')

const { createMilestone, deleteMilestone } = require('../controllers/milestone.controller')

const {
    getAllCustomers,
    blockCustomer,
    unblockCustomer
} = require('../controllers/customer.controller')

const {
    createService,
    updateService,
    deactivateService,
    activateService
} = require('../controllers/service.controller')
const { adminProtected } = require('../middlewares/Protected')
const { getAllBookings, getAvailableNurses, assignNurse } = require('../controllers/booking.controller')
const router = require('express').Router()


// ════════════════════════════════════════════════
// NURSE MANAGEMENT
// ════════════════════════════════════════════════
router
    .get('/nurses', adminProtected, getAllNurses)
    .get('/nurses/pending', adminProtected, getPendingNurses)
    .put('/nurses/approve/:nurseId', adminProtected, approveNurse)
    .put('/nurses/reject/:nurseId', adminProtected, rejectNurse)
    .put('/nurses/suspend/:nurseId', adminProtected, suspendNurse)

    // ════════════════════════════════════════════════
    // CUSTOMER MANAGEMENT
    // ════════════════════════════════════════════════
    .get('/customers', adminProtected, getAllCustomers)
    .put('/customers/block/:customerId', adminProtected, blockCustomer)
    .put('/customers/unblock/:customerId', adminProtected, unblockCustomer)

    // ════════════════════════════════════════════════
    // SERVICE MANAGEMENT
    // ════════════════════════════════════════════════
    .post('/services', adminProtected, createService)
    .put('/services/:serviceId', adminProtected, updateService)
    .put('/services/deactivate/:serviceId', adminProtected, deactivateService)
    .put('/services/activate/:serviceId', adminProtected, activateService)


    // Bookings
    .get('/get-all-bookings', adminProtected, getAllBookings)
    .get('/available-nurses/:bookingId', adminProtected, getAvailableNurses)
    .put('/assign/:bookingId', adminProtected, assignNurse)

    // Milestones Management
    .post('/milestones', adminProtected, createMilestone)
    .delete('/milestones/:id', adminProtected, deleteMilestone)
module.exports = router