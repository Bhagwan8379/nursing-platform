// controllers/notification.controller.js

const asyncHandler = require('express-async-handler')
const Notification = require('../models/Notification')

// ─── Get My Notifications ──────────────────────
exports.getNotifications = asyncHandler(async (req, res) => {
    try {
        const result = await Notification.find({ userId: req.user })
            .sort({ createdAt: -1 })

        // Unread count
        const unreadCount = await Notification.countDocuments({
            userId: req.user,
            isRead: false
        })

        res.json({
            message: "Notifications Fetched Successfully",
            unreadCount,
            result
        })
    } catch (error) {
        console.log('Error From : getNotifications')
        return res.status(500).json({ message: "Internal Server Error" })
    }
})

// ─── Mark Single As Read ───────────────────────
exports.markAsRead = asyncHandler(async (req, res) => {
    try {
        const { notificationId } = req.params

        const notification = await Notification.findById(notificationId)
        if (!notification) {
            return res.status(404).json({ message: "Notification Not Found" })
        }

        // हे notification या user चं आहे का?
        if (notification.userId.toString() !== req.user.toString()) {
            return res.status(403).json({ message: "Not Your Notification" })
        }

        await Notification.findByIdAndUpdate(notificationId, { isRead: true })
        res.json({ message: "Marked As Read Successfully" })

    } catch (error) {
        console.log('Error From : markAsRead')
        return res.status(500).json({ message: "Internal Server Error" })
    }
})

// ─── Mark All As Read ──────────────────────────
exports.markAllRead = asyncHandler(async (req, res) => {
    try {
        await Notification.updateMany({ userId: req.user, isRead: false }, { isRead: true })
        res.json({ message: "All Notifications Marked As Read" })
    } catch (error) {
        console.log('Error From : markAllRead')
        return res.status(500).json({ message: "Internal Server Error" })
    }
})

// ─── Send Notification (Admin Broadcast) ───────
exports.sendBroadcast = asyncHandler(async (req, res) => {
    try {
        const { title, message, type, userIds } = req.body

        // userIds array असेल तर specific users ला
        // नसेल तर सगळ्यांना
        if (userIds && userIds.length > 0) {
            const notifications = userIds.map(userId => ({
                userId,
                title,
                message,
                type: type || 'system'
            }))
            await Notification.insertMany(notifications)
        }

        res.json({ message: "Broadcast Sent Successfully" })
    } catch (error) {
        console.log('Error From : sendBroadcast')
        return res.status(500).json({ message: "Internal Server Error" })
    }
})

// ─── Create Notification (Internal use) ────────
// हे function दुसऱ्या controllers मधून call करतो
exports.createNotification = async (userId, title, message, type, refId) => {
    try {
        await Notification.create({
            userId,
            title,
            message,
            type: type || 'system',
            refId: refId || null
        })
    } catch (error) {
        console.log('Error From : createNotification', error)
    }
}