const mongoose = require('mongoose')

const authSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, unique: true },
    mobile: { type: String, required: true, trim: true },
    password: { type: String, required: true, trim: true },
    role: { type: String, enum: ['admin', 'nurse', 'customer'], default: 'customer' },
    isActive: { type: Boolean, default: true },
    isVerify: { type: Boolean, default: false },
    fcmToken: { type: String },
    profilePhoto: { type: String, default: "" },
}, { timestamps: true })

module.exports = mongoose.model('Auth', authSchema)