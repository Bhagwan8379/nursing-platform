const mongoose = require('mongoose')



const notificationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Auth', required: true },
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    type: { type: String, enum: ['booking', 'payment', 'nurse_update', 'system'], default: 'system' },
    refId: { type: mongoose.Schema.Types.ObjectId, default: null }
}, { timestamps: true })

module.exports = mongoose.model("Notification", notificationSchema)