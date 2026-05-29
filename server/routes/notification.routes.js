const {
    getNotifications,
    markAsRead,
    markAllRead,
    sendBroadcast
} = require('../controllers/notification.controller')
const { adminProtected, nurseProtected, customerProtected } = require('../middlewares/Protected')
const router = require('express').Router()

// ─── Common Routes ─────────────────────────────
router
    .get('/admin-notification', adminProtected, getNotifications)
    .get('/nurse-notification', nurseProtected, getNotifications)
    .get('/customer-notification', customerProtected, getNotifications)
    .put('/mark-as-read/:notificationId', customerProtected, markAsRead)
    .put('/mark-as-read-all', customerProtected, markAllRead)

    // ─── Admin Routes ──────────────────────────────
    .post('/broadcast', adminProtected, sendBroadcast)

module.exports = router