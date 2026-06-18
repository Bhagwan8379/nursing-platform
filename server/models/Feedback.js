const mongoose = require('mongoose')

const feedbackSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Auth', required: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true },
    showInTestimonials: { type: Boolean, default: false }
}, { timestamps: true })

module.exports = mongoose.model('Feedback', feedbackSchema)
